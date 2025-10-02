import { serverSupabaseServiceRole } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseServiceRole(event);

  try {
    // Fetch all completed series results
    const { data: results, error: resultsError } = await supabase
      .from("playoff_results")
      .select("*")
      .not("series_end_date", "is", null)
      .order("series_end_date", { ascending: true });

    if (resultsError) {
      console.error("Error fetching playoff results:", resultsError);
      throw resultsError;
    }

    if (!results || results.length === 0) {
      return {
        success: true,
        message: "No playoff results to score yet",
        bracketsScored: 0,
      };
    }

    // Fetch all brackets for 2025
    const { data: brackets, error: bracketsError } = await supabase
      .from("playoff_brackets")
      .select("*")
      .eq("year", 2025);

    if (bracketsError) {
      console.error("Error fetching brackets:", bracketsError);
      throw bracketsError;
    }

    if (!brackets || brackets.length === 0) {
      return {
        success: true,
        message: "No brackets to score",
        bracketsScored: 0,
      };
    }

    // Point values by round
    const POINTS = {
      wild_card: 10,
      division: 20,
      championship: 30,
      world_series: 40,
    };

    // Process each bracket
    const updates = [];

    for (const bracket of brackets) {
      let points = 0;

      // Score Wild Card rounds
      for (const result of results.filter((r) => r.round === "wild_card")) {
        // AL Wild Card Game 1 (3v6)
        if (result.series_id === "2025-ALWC1") {
          if (bracket.al_wildcard_1_winner === result.winning_team_id) {
            points += POINTS.wild_card;
          }
        }
        // AL Wild Card Game 2 (4v5)
        else if (result.series_id === "2025-ALWC2") {
          if (bracket.al_wildcard_2_winner === result.winning_team_id) {
            points += POINTS.wild_card;
          }
        }
        // NL Wild Card Game 1 (3v6)
        else if (result.series_id === "2025-NLWC1") {
          if (bracket.nl_wildcard_1_winner === result.winning_team_id) {
            points += POINTS.wild_card;
          }
        }
        // NL Wild Card Game 2 (4v5)
        else if (result.series_id === "2025-NLWC2") {
          if (bracket.nl_wildcard_2_winner === result.winning_team_id) {
            points += POINTS.wild_card;
          }
        }
      }

      // Score Division Series
      for (const result of results.filter((r) => r.round === "division")) {
        // ALDS Game 1 (2 seed vs WC winner)
        if (result.series_id === "2025-ALDS1") {
          if (bracket.al_division_1_winner === result.winning_team_id) {
            points += POINTS.division;
          }
        }
        // ALDS Game 2 (1 seed vs WC winner)
        else if (result.series_id === "2025-ALDS2") {
          if (bracket.al_division_2_winner === result.winning_team_id) {
            points += POINTS.division;
          }
        }
        // NLDS Game 1 (2 seed vs WC winner)
        else if (result.series_id === "2025-NLDS1") {
          if (bracket.nl_division_1_winner === result.winning_team_id) {
            points += POINTS.division;
          }
        }
        // NLDS Game 2 (1 seed vs WC winner)
        else if (result.series_id === "2025-NLDS2") {
          if (bracket.nl_division_2_winner === result.winning_team_id) {
            points += POINTS.division;
          }
        }
      }

      // Score Championship Series
      for (const result of results.filter((r) => r.round === "championship")) {
        if (result.series_id === "2025-ALCS") {
          if (bracket.al_championship_winner === result.winning_team_id) {
            points += POINTS.championship;
          }
        } else if (result.series_id === "2025-NLCS") {
          if (bracket.nl_championship_winner === result.winning_team_id) {
            points += POINTS.championship;
          }
        }
      }

      // Score World Series
      for (const result of results.filter((r) => r.round === "world_series")) {
        if (result.series_id === "2025-WS") {
          if (bracket.world_series_champion === result.winning_team_id) {
            points += POINTS.world_series;
          }
        }
      }

      // Update bracket with new points
      updates.push({
        user_id: bracket.user_id,
        year: bracket.year,
        bracket_name: bracket.bracket_name,
        points_earned: points,
        last_scored_at: new Date().toISOString(),
      });
    }

    // Batch update all brackets
    const { error: updateError } = await supabase
      .from("playoff_brackets")
      .upsert(updates, {
        onConflict: "user_id,year,bracket_name",
      });

    if (updateError) {
      console.error("Error updating bracket scores:", updateError);
      throw updateError;
    }

    return {
      success: true,
      message: `Successfully scored ${brackets.length} brackets`,
      bracketsScored: brackets.length,
      resultsProcessed: results.length,
      updates: updates.map((u) => ({
        user_id: u.user_id,
        points: u.points_earned,
      })),
    };
  } catch (error: any) {
    console.error("Error in scoreBrackets:", error);
    return {
      success: false,
      error: error.message || "Unknown error occurred",
    };
  }
});
