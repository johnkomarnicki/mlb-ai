import { Database } from "../../database.types";
import { serverSupabaseServiceRole } from "#supabase/server";
import { DateTime } from "luxon";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole<Database>(event);

  const yesterday = DateTime.now().minus({ days: 1 }).toFormat("yyyy-MM-dd");
  const scheduleRes = await $fetch(
    `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${yesterday}`
  );

  const convertIP = (ip: string | number): number => {
    if (typeof ip === "string" && ip.includes(".")) {
      const [whole, part] = ip.split(".").map(Number);
      return whole + part / 3;
    }
    return Number(ip) || 0;
  };

  for (const date of scheduleRes.dates || []) {
    for (const game of date.games || []) {
      if (game.status?.detailedState !== "Final") {
        console.log(
          `⏭️ Skipping Game ${game.gamePk} - Status: ${game.status?.detailedState}`
        );
        continue;
      }

      const gameId = game.gamePk;

      const gameDateEST = DateTime.fromISO(game.gameDate, { zone: "utc" })
        .setZone("America/New_York")
        .toISODate();

      const homeTeam = game.teams.home.team;
      const awayTeam = game.teams.away.team;

      const homeScore = game.teams.home.score;
      const awayScore = game.teams.away.score;

      await client.from("games").upsert(
        {
          gameId,
          gameDate: gameDateEST,
          homeId: homeTeam.id,
          homeTeam: homeTeam.name,
          awayId: awayTeam.id,
          awayTeam: awayTeam.name,
          homeScore,
          awayScore,
          finalScore:
            homeScore != null && awayScore != null
              ? homeScore + awayScore
              : null,
          homeWin:
            homeScore != null && awayScore != null
              ? homeScore > awayScore
              : null,
        },
        { onConflict: "gameId" }
      );

      const boxscore = await $fetch(
        `https://statsapi.mlb.com/api/v1/game/${gameId}/boxscore`
      );

      for (const teamKey of ["home", "away"] as const) {
        const teamBox = boxscore.teams[teamKey];
        const pitcherIds = teamBox.pitchers || [];
        const startingPitcherId = pitcherIds[0];
        const teamName = teamKey === "home" ? homeTeam.name : awayTeam.name;
        const teamId = teamKey === "home" ? homeTeam.id : awayTeam.id;

        if (startingPitcherId) {
          const player = teamBox.players[`ID${startingPitcherId}`];
          const stats = player.stats.pitching || {};
          const ip = convertIP(stats.inningsPitched);
          const er = stats.earnedRuns || 0;

          await client
            .from("pitcherStats")
            .upsert(
              {
                gameId,
                gameDate: gameDateEST,
                pitcherId: player.person.id,
                pitcherName: player.person.fullName,
                team: teamKey,
                teamId,
                teamName,
                era: ip ? +((er / ip) * 9).toFixed(2) : null,
                whip: ip
                  ? +((stats.baseOnBalls + stats.hits) / ip).toFixed(2)
                  : null,
                so9: ip ? +((stats.strikeOuts / ip) * 9).toFixed(2) : null,
                bb9: ip ? +((stats.baseOnBalls / ip) * 9).toFixed(2) : null,
                hr9: ip ? +((stats.homeRuns / ip) * 9).toFixed(2) : null,
                inningsPitched: ip,
                wins: stats.wins || 0,
                losses: stats.losses || 0,
                isStarter: true,
              },
              { onConflict: "gameId,teamId" }
            )
            .select("*");
        }

        // Bullpen stats
        let bullpen_ip = 0,
          bullpen_so = 0,
          bullpen_bb = 0,
          bullpen_er = 0,
          bullpen_hits = 0;

        for (const p of Object.values(teamBox.players)) {
          if (
            p.position.code === "1" &&
            p.stats?.pitching?.gamesStarted === 0
          ) {
            const stat = p.stats.pitching;
            const ip = convertIP(stat.inningsPitched);
            bullpen_ip += ip;
            bullpen_so += stat.strikeOuts || 0;
            bullpen_bb += stat.baseOnBalls || 0;
            bullpen_er += stat.earnedRuns || 0;
            bullpen_hits += stat.hits || 0;
          }
        }

        const batting = teamBox.teamStats?.batting || {};
        const fielding = teamBox.teamStats?.fielding || {};

        const { data, error } = await client
          .from("teamStats")
          .upsert(
            {
              gameId,
              gameDate: gameDateEST,
              teamId,
              teamName,
              isHome: teamKey === "home",
              battingAvg: +batting.avg || 0,
              obp: +batting.obp || 0,
              slg: +batting.slg || 0,
              ops: +batting.ops || 0,
              runsPerGame: +batting.runs || 0,
              strikeoutsPerGame: +batting.strikeOuts || 0,
              walksPerGame: +batting.baseOnBalls || 0,
              rbiPerGame: +batting.rbi || 0,
              hitsPerGame: +batting.hits || 0,
              homeRunsPerGame: +batting.homeRuns || 0,
              leftOnBase: +batting.leftOnBase || 0,
              bullpenInningsPitched: bullpen_ip,
              bullpenEra: bullpen_ip
                ? +((bullpen_er / bullpen_ip) * 9).toFixed(2)
                : null,
              bullpenWhip: bullpen_ip
                ? +((bullpen_bb + bullpen_hits) / bullpen_ip).toFixed(2)
                : null,
              bullpenSo9: bullpen_ip
                ? +((bullpen_so / bullpen_ip) * 9).toFixed(2)
                : null,
              errorsPerGame: +teamBox.errors || 0,
              defEfficiency: +fielding.fieldingPercentage || 0,
            },
            { onConflict: "gameId, teamId" }
          )
          .select("*");
      }
    }
  }

  return { success: true };
});
