import { serverSupabaseServiceRole } from "#supabase/server";
import { DateTime } from "luxon";

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseServiceRole(event);

  const { data: teamStatsRaw } = await client
    .from("teamStats")
    .select("*")
    .order("gameDate", { ascending: false })
    .limit(1000);

  if (!teamStatsRaw) return { error: "No team stats found" };

  const groupedTeams = groupRecentTeamStats(teamStatsRaw, 14);

  const { data: pitcherStatsRaw } = await client
    .from("pitcherStats")
    .select("*")
    .eq("isStarter", true)
    .order("gameDate", { ascending: false })
    .limit(1000);

  if (!pitcherStatsRaw) return { error: "No pitcher stats found" };

  const groupedPitchers = groupRecentPitcherStats(pitcherStatsRaw, 5);

  const merged = groupedTeams.map((team) => {
    const pitcher = groupedPitchers.find((p) => p.teamId === team.teamId) || {};
    return {
      ...team,
      ...pitcher,
      createdAt: DateTime.now().toUTC().toISO(),
    };
  });

  const { error } = await client
    .from("recentTeamPerformance")
    .upsert(merged, { onConflict: "teamId" });

  return { success: !error, error };
});

// --- Helpers ---
function groupRecentTeamStats(data: any[], limitPerTeam: number) {
  const sorted = [...data].sort((a, b) => {
    if (a.teamId !== b.teamId) return a.teamId - b.teamId;
    return new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime();
  });

  const grouped: Record<number, any[]> = {};
  for (const row of sorted) {
    const id = row.teamId;
    if (!grouped[id]) grouped[id] = [];
    if (grouped[id].length < limitPerTeam) grouped[id].push(row);
  }

  return Object.entries(grouped).map(([teamId, rows]) => {
    const values = aggregateAverages(rows as any[]);
    return { teamId: Number(teamId), ...values };
  });
}

function groupRecentPitcherStats(data: any[], limitPerTeam: number) {
  const sorted = [...data].sort((a, b) => {
    if (a.teamId !== b.teamId) return a.teamId - b.teamId;
    return new Date(b.gameDate).getTime() - new Date(a.gameDate).getTime();
  });

  const grouped: Record<number, any[]> = {};
  for (const row of sorted) {
    const id = row.teamId;
    if (!grouped[id]) grouped[id] = [];
    if (grouped[id].length < limitPerTeam) grouped[id].push(row);
  }

  return Object.entries(grouped).map(([teamId, rows]) => {
    const values = aggregateAverages(rows as any[], true);
    return { teamId: Number(teamId), ...values };
  });
}

function aggregateAverages(rows: any[], isPitcher = false) {
  const fields = isPitcher
    ? ["era", "whip", "so9", "bb9", "hr9", "inningsPitched"]
    : [
        "teamName",
        "battingAvg",
        "obp",
        "slg",
        "ops",
        "runsPerGame",
        "strikeoutsPerGame",
        "walksPerGame",
        "rbiPerGame",
        "hitsPerGame",
        "leftOnBase",
        "errorsPerGame",
        "defEfficiency",
        "homeRunsPerGame",
        "bullpenEra",
        "bullpenWhip",
        "bullpenSo9",
        "bullpenInningsPitched",
      ];

  const result: Record<string, any> = {};

  for (const field of fields) {
    if (field === "teamName") {
      result.teamName = rows[rows.length - 1].teamName;
    } else {
      const values = rows
        .map((r) => parseFloat(r[field]))
        .filter((v) => !isNaN(v));
      const avg = values.length
        ? values.reduce((a, b) => a + b, 0) / values.length
        : null;
      const key = isPitcher ? `pitcher${capitalize(field)}` : field;
      result[key] = avg !== null ? +avg.toFixed(3) : null;
    }
  }

  return result;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
