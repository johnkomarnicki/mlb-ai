// server/api/get-daily-matchups.ts
import { Database } from "../../database.types";
import { serverSupabaseServiceRole } from "#supabase/server";
import { DateTime } from "luxon";
import { fetchAndStoreWeather } from "../utils/fetchAndStoreWeather";

export default defineEventHandler(async (event) => {
  try {
    const client = await serverSupabaseServiceRole<Database>(event);

    const today = DateTime.utc().toISODate();

    const scheduleUrl = `https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${today}`;
    const scheduleRes = await fetch(scheduleUrl);
    
    if (!scheduleRes.ok) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch MLB schedule: ${scheduleRes.status}`
      });
    }
    
    const scheduleJson = await scheduleRes.json();
    const games = scheduleJson?.dates?.[0]?.games || [];

  const localZone = "America/New_York";
  const records = [];

  const fetchStarterStats = async (pitcherId: number | null) => {
    if (!pitcherId) return {};
    try {
      const statsUrl = `https://statsapi.mlb.com/api/v1/people/${pitcherId}/stats?stats=season&group=pitching`;
      const res = await fetch(statsUrl);
      
      if (!res.ok) {
        console.warn(`Failed to fetch stats for pitcher ${pitcherId}: ${res.status}`);
        return {};
      }
      
      const data = await res.json();
      const stat = data.stats?.[0]?.splits?.[0]?.stat;
      return {
        era: parseFloat(stat?.era ?? null),
        whip: parseFloat(stat?.whip ?? null),
        so9: parseFloat(stat?.strikeoutsPer9Inn ?? null),
        bb9: parseFloat(stat?.walksPer9Inn ?? null),
        hr9: parseFloat(stat?.homeRunsPer9 ?? null),
        inningsPitched: parseFloat(stat?.inningsPitched ?? null),
      };
    } catch (error) {
      console.warn(`Error fetching stats for pitcher ${pitcherId}:`, error);
      return {};
    }
  };

  for (const game of games) {
    const gameId = game.gamePk;

    const localDate = DateTime.fromISO(game.gameDate, { zone: "utc" })
      .setZone(localZone)
      .toISODate();

    const homeTeam = game.teams.home.team;
    const awayTeam = game.teams.away.team;

    const liveUrl = `https://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`;
    const liveRes = await fetch(liveUrl);
    
    if (!liveRes.ok) {
      console.warn(`Failed to fetch live data for game ${gameId}: ${liveRes.status}`);
      continue;
    }
    
    const liveJson = await liveRes.json();

    const probables = liveJson?.gameData?.probablePitchers || {};
    const homePitcher = probables.home;
    const awayPitcher = probables.away;

    try {
      await fetchAndStoreWeather(gameId, client);
    } catch (error) {
      console.warn(`Weather fetch failed for game ${gameId}:`, error);
    }
    
    const homeStats = await fetchStarterStats(homePitcher?.id);
    const awayStats = await fetchStarterStats(awayPitcher?.id);

    records.push({
      gameId,
      gameDate: localDate,
      gameTime: game.gameDate,
      homeTeamId: homeTeam.id,
      homeTeamName: homeTeam.name,
      awayTeamId: awayTeam.id,
      awayTeamName: awayTeam.name,
      homePitcherId: homePitcher?.id ?? 123,
      homePitcherName: homePitcher?.fullName ?? null,
      awayPitcherId: awayPitcher?.id ?? 123,
      awayPitcherName: awayPitcher?.fullName ?? null,
      homeStarterEra: homeStats.era ?? null,
      homeStarterWhip: homeStats.whip ?? null,
      homeStarterSo9: homeStats.so9 ?? null,
      homeStarterBb9: homeStats.bb9 ?? null,
      homeStarterHr9: homeStats.hr9 ?? null,
      homeStarterInningsPitched: homeStats.inningsPitched ?? null,
      awayStarterEra: awayStats.era ?? null,
      awayStarterWhip: awayStats.whip ?? null,
      awayStarterSo9: awayStats.so9 ?? null,
      awayStarterBb9: awayStats.bb9 ?? null,
      awayStarterHr9: awayStats.hr9 ?? null,
      awayStarterInningsPitched: awayStats.inningsPitched ?? null,
      createdAt: new Date().toISOString(),
    });
  }

  if (records.length > 0) {
    const { error } = await client
      .from("todaysGames")
      .upsert(records, { onConflict: "gameId" });

    if (error) {
      console.error("❌ Supabase error:", error.message);
      return { error: error.message };
    }

    return { message: `✅ Upserted ${records.length} games into todaysGames` };
  } else {
    return { message: "⚠️ No games found for today" };
  }
  
  } catch (error) {
    console.error("❌ API Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: `MLB API Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
});
