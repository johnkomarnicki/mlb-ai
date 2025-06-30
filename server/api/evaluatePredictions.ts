import { serverSupabaseClient } from "#supabase/server";
import { DateTime } from "luxon";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  const today = DateTime.now().minus({ days: 1 }).toFormat("yyyy-MM-dd");

  // Step 1: Get today's predictions
  const { data: predictions, error } = await client.from("gamePredictions").select("*").eq("gameDate", today);

  if (error)
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to load predictions",
    });

  const results = [];

  for (const prediction of predictions) {
    const { gameId, homeTeamId, awayTeamId, teamEdgeId, teamEdgeName } = prediction;

    // Step 2: Fetch game data from MLB API
    const mlbRes = await fetch(`https://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`);
    if (!mlbRes.ok) {
      results.push({
        gameId,
        status: "skipped",
        reason: "MLB API fetch failed",
      });
      continue;
    }

    const gameData = await mlbRes.json();

    const status = gameData?.gameData?.status?.abstractGameState;
    const homeRuns = gameData?.liveData?.linescore?.teams?.home?.runs;
    const awayRuns = gameData?.liveData?.linescore?.teams?.away?.runs;

    // Step 3: Only continue if game is Final
    if (status !== "Final" || homeRuns == null || awayRuns == null) {
      results.push({ gameId, status: "skipped", reason: "Game not completed" });
      continue;
    }

    // Step 4: Determine official winner
    const winnerTeamId = homeRuns > awayRuns ? homeTeamId : awayTeamId;

    // Step 5: Update correctOutcome
    const { data, error: updateError } = await client.from("gamePredictions").update({ winningTeam: winnerTeamId }).eq("gameId", gameId);

    // results.push({
    //   gameId,
    //   homeRuns,
    //   awayRuns,
    //   edgeTeamId: teamEdgeId,
    //   edgeTeamName,
    //   winnerTeamId,
    //   correctOutcome: correct,
    //   updated: !updateError,
    // });
  }

  return { date: today, evaluated: results.length, results };
});
