import { serverSupabaseServiceRole, serverSupabaseUser } from "#supabase/server";

/**
 * API endpoint to add/update playoff series results
 * Admin only - used to enter actual playoff outcomes
 */
export default defineEventHandler(async (event) => {
  // Check if user is admin using the authenticated client
  const user = await serverSupabaseUser(event);
  const isAdmin = user?.email === "johnkomarnickicontact@gmail.com";

  if (!isAdmin) {
    throw createError({
      statusCode: 403,
      message: "Unauthorized - Admin only",
    });
  }

  // Use service role for database operations
  const supabase = await serverSupabaseServiceRole(event);

  // Get request body
  const body = await readBody(event);
  const {
    series_id,
    round,
    winning_team_id,
    losing_team_id,
    series_end_date,
    games_won,
    games_lost,
  } = body;

  // Validate required fields
  if (!series_id || !round || !winning_team_id || !losing_team_id) {
    throw createError({
      statusCode: 400,
      message: "Missing required fields: series_id, round, winning_team_id, losing_team_id",
    });
  }

  // Validate round
  const validRounds = ["wild_card", "division", "championship", "world_series"];
  if (!validRounds.includes(round)) {
    throw createError({
      statusCode: 400,
      message: `Invalid round. Must be one of: ${validRounds.join(", ")}`,
    });
  }

  try {
    // Upsert the result
    const { data, error } = await supabase
      .from("playoff_results")
      .upsert(
        {
          series_id,
          round,
          winning_team_id,
          losing_team_id,
          series_end_date: series_end_date || new Date().toISOString(),
          games_won: games_won || null,
          games_lost: games_lost || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "series_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Error adding playoff result:", error);
      throw error;
    }

    // Automatically trigger bracket scoring after adding result
    await $fetch("/api/scoreBrackets");

    return {
      success: true,
      message: "Playoff result added and brackets scored",
      data,
    };
  } catch (error: any) {
    console.error("Error in addPlayoffResult:", error);
    throw createError({
      statusCode: 500,
      message: error.message || "Failed to add playoff result",
    });
  }
});
