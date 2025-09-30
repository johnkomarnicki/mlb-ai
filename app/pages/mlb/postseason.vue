<script setup>
// Set SEO meta tags
useSeoMeta({
  title: "2025 MLB Postseason Bracket",
  description:
    "Make your predictions for the 2025 MLB Postseason. Pick winners for Wild Card, Division Series, Championship Series, and World Series matchups.",
  ogTitle: "2025 MLB Postseason Bracket",
  ogDescription:
    "Make your predictions for the 2025 MLB Postseason. Pick winners for Wild Card, Division Series, Championship Series, and World Series matchups.",
  twitterTitle: "2025 MLB Postseason Bracket",
  twitterDescription:
    "Make your predictions for the 2025 MLB Postseason. Pick winners for Wild Card, Division Series, Championship Series, and World Series matchups.",
});

// Supabase client and user
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const toast = useToast();

// First game deadline - September 30, 2025, 1:08 PM EST
const FIRST_GAME_TIME = new Date("2025-09-30T13:08:00-04:00");

// Bracket lock state
const isBracketLocked = ref(false);
const timeRemaining = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
});

// Calculate time remaining
function updateCountdown() {
  const now = new Date();
  const difference = FIRST_GAME_TIME.getTime() - now.getTime();

  if (difference <= 0) {
    isBracketLocked.value = true;
    timeRemaining.value = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return false; // Stop the interval
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  timeRemaining.value = { days, hours, minutes, seconds };
  return true; // Continue the interval
}

// Set up countdown timer
let countdownInterval;
onMounted(() => {
  updateCountdown();
  countdownInterval = setInterval(() => {
    if (!updateCountdown()) {
      clearInterval(countdownInterval);
    }
  }, 1000);
});

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
});

// 2025 MLB Postseason Bracket Teams

// American League Playoff Teams (Seeded 1-6)
const americanLeaguePlayoffs = [
  { seed: 1, id: 141, name: "Toronto Blue Jays", abbreviation: "TOR" },
  { seed: 2, id: 136, name: "Seattle Mariners", abbreviation: "SEA" },
  { seed: 3, id: 114, name: "Cleveland Guardians", abbreviation: "CLE" },
  { seed: 4, id: 147, name: "New York Yankees", abbreviation: "NYY" },
  { seed: 5, id: 111, name: "Boston Red Sox", abbreviation: "BOS" },
  { seed: 6, id: 116, name: "Detroit Tigers", abbreviation: "DET" },
];

// National League Playoff Teams (Seeded 1-6)
const nationalLeaguePlayoffs = [
  { seed: 1, id: 158, name: "Milwaukee Brewers", abbreviation: "MIL" },
  { seed: 2, id: 143, name: "Philadelphia Phillies", abbreviation: "PHI" },
  { seed: 3, id: 119, name: "Los Angeles Dodgers", abbreviation: "LAD" },
  { seed: 4, id: 112, name: "Chicago Cubs", abbreviation: "CHC" },
  { seed: 5, id: 135, name: "San Diego Padres", abbreviation: "SD" },
  { seed: 6, id: 113, name: "Cincinnati Reds", abbreviation: "CIN" },
];

// Wildcard matchups based on seeding
const wildcardMatchups = reactive({
  americanLeague: [
    { higher: 3, lower: 6, winner: null, winnerId: null }, // Guardians vs Tigers
    { higher: 4, lower: 5, winner: null, winnerId: null }, // Yankees vs Red Sox
  ],
  nationalLeague: [
    { higher: 3, lower: 6, winner: null, winnerId: null }, // Dodgers vs Reds
    { higher: 4, lower: 5, winner: null, winnerId: null }, // Cubs vs Padres
  ],
});

// Division Series matchups (will be populated after wildcard)
const divisionSeriesMatchups = reactive({
  americanLeague: [
    {
      higher: 2, // Mariners (2nd seed) - TOP POSITION
      lower: null, // Winner of 3v6 wildcard matchup
      lowerId: null, // Team ID of wildcard winner
      winner: null,
      winnerId: null,
    },
    {
      higher: 1, // Blue Jays (top seed) - BOTTOM POSITION
      lower: null, // Winner of 4v5 wildcard matchup
      lowerId: null, // Team ID of wildcard winner
      winner: null,
      winnerId: null,
    },
  ],
  nationalLeague: [
    {
      higher: 2, // Phillies (2nd seed) - TOP POSITION
      lower: null, // Winner of 3v6 wildcard matchup
      lowerId: null, // Team ID of wildcard winner
      winner: null,
      winnerId: null,
    },
    {
      higher: 1, // Brewers (top seed) - BOTTOM POSITION
      lower: null, // Winner of 4v5 wildcard matchup
      lowerId: null, // Team ID of wildcard winner
      winner: null,
      winnerId: null,
    },
  ],
});

// Championship Series matchups
const championshipSeriesMatchups = reactive({
  americanLeague: {
    team1: null, // Winner of ALDS matchup 1
    team1Id: null, // Team ID of ALDS winner
    team2: null, // Winner of ALDS matchup 2
    team2Id: null, // Team ID of ALDS winner
    winner: null,
    winnerId: null,
  },
  nationalLeague: {
    team1: null, // Winner of NLDS matchup 1
    team1Id: null, // Team ID of NLDS winner
    team2: null, // Winner of NLDS matchup 2
    team2Id: null, // Team ID of NLDS winner
    winner: null,
    winnerId: null,
  },
});

// World Series matchup
const worldSeriesMatchup = reactive({
  americanLeague: null, // ALCS winner
  americanLeagueId: null, // Team ID of ALCS winner
  nationalLeague: null, // NLCS winner
  nationalLeagueId: null, // Team ID of NLCS winner
  champion: null,
  championId: null, // Team ID of champion
});

// Function to advance teams (can be used when users select winners)
function advanceWildcardWinner(league, matchupIndex, winningSeed) {
  // Check if bracket is locked
  if (isBracketLocked.value) {
    toast.add({
      color: "red",
      title: "Bracket Locked",
      description: "Predictions are closed. The playoffs have begun!",
    });
    return;
  }

  const matchup = wildcardMatchups[league][matchupIndex];
  const winningTeamId =
    league === "americanLeague"
      ? americanLeaguePlayoffs[winningSeed - 1].id
      : nationalLeaguePlayoffs[winningSeed - 1].id;

  matchup.winner = winningSeed;
  matchup.winnerId = winningTeamId;

  // Determine which division series matchup this affects
  const dsMatchupIndex = matchupIndex === 0 ? 0 : 1;

  // Clear any dependent selections if changing a pick
  if (divisionSeriesMatchups[league][dsMatchupIndex].lower !== winningSeed) {
    // Clear division series winner if it was the previous wildcard winner
    if (
      divisionSeriesMatchups[league][dsMatchupIndex].winner ===
      divisionSeriesMatchups[league][dsMatchupIndex].lower
    ) {
      divisionSeriesMatchups[league][dsMatchupIndex].winner = null;
      divisionSeriesMatchups[league][dsMatchupIndex].winnerId = null;

      // Clear championship series if this team was there
      if (
        dsMatchupIndex === 0 &&
        championshipSeriesMatchups[league].team1 ===
          divisionSeriesMatchups[league][dsMatchupIndex].lower
      ) {
        championshipSeriesMatchups[league].team1 = null;
        championshipSeriesMatchups[league].team1Id = null;
      } else if (
        dsMatchupIndex === 1 &&
        championshipSeriesMatchups[league].team2 ===
          divisionSeriesMatchups[league][dsMatchupIndex].lower
      ) {
        championshipSeriesMatchups[league].team2 = null;
        championshipSeriesMatchups[league].team2Id = null;
      }

      // Clear championship series winner if affected
      if (championshipSeriesMatchups[league].winner) {
        championshipSeriesMatchups[league].winner = null;
        championshipSeriesMatchups[league].winnerId = null;

        // Clear World Series if affected
        if (league === "americanLeague") {
          worldSeriesMatchup.americanLeague = null;
          worldSeriesMatchup.americanLeagueId = null;
        } else {
          worldSeriesMatchup.nationalLeague = null;
          worldSeriesMatchup.nationalLeagueId = null;
        }

        // Clear World Series champion if affected
        worldSeriesMatchup.champion = null;
        worldSeriesMatchup.championId = null;
      }
    }
  }

  // Advance to Division Series
  // 3v6 winner faces 2 seed (top position, index 0)
  // 4v5 winner faces 1 seed (bottom position, index 1)
  if (matchupIndex === 0) {
    // First matchup (3v6) winner faces 2 seed (top position)
    divisionSeriesMatchups[league][0].lower = winningSeed;
    divisionSeriesMatchups[league][0].lowerId = winningTeamId;
  } else {
    // Second matchup (4v5) winner faces 1 seed (bottom position)
    divisionSeriesMatchups[league][1].lower = winningSeed;
    divisionSeriesMatchups[league][1].lowerId = winningTeamId;
  }

  // Auto-save after each selection
  if (user.value) {
    saveBracketToDatabase();
  }
}

function advanceDivisionSeriesWinner(league, matchupIndex, winningSeed) {
  // Check if bracket is locked
  if (isBracketLocked.value) {
    toast.add({
      color: "red",
      title: "Bracket Locked",
      description: "Predictions are closed. The playoffs have begun!",
    });
    return;
  }

  const winningTeamId =
    league === "americanLeague"
      ? americanLeaguePlayoffs[winningSeed - 1].id
      : nationalLeaguePlayoffs[winningSeed - 1].id;

  const previousWinner = divisionSeriesMatchups[league][matchupIndex].winner;

  divisionSeriesMatchups[league][matchupIndex].winner = winningSeed;
  divisionSeriesMatchups[league][matchupIndex].winnerId = winningTeamId;

  // Clear dependent selections if changing a pick
  if (previousWinner && previousWinner !== winningSeed) {
    // Clear championship series for this team
    if (
      matchupIndex === 0 &&
      championshipSeriesMatchups[league].team1 === previousWinner
    ) {
      championshipSeriesMatchups[league].team1 = null;
      championshipSeriesMatchups[league].team1Id = null;
    } else if (
      matchupIndex === 1 &&
      championshipSeriesMatchups[league].team2 === previousWinner
    ) {
      championshipSeriesMatchups[league].team2 = null;
      championshipSeriesMatchups[league].team2Id = null;
    }

    // Clear championship series winner if it was the previous winner
    if (championshipSeriesMatchups[league].winner === previousWinner) {
      championshipSeriesMatchups[league].winner = null;
      championshipSeriesMatchups[league].winnerId = null;

      // Clear World Series
      if (league === "americanLeague") {
        worldSeriesMatchup.americanLeague = null;
        worldSeriesMatchup.americanLeagueId = null;
      } else {
        worldSeriesMatchup.nationalLeague = null;
        worldSeriesMatchup.nationalLeagueId = null;
      }

      // Clear World Series champion
      worldSeriesMatchup.champion = null;
      worldSeriesMatchup.championId = null;
    }
  }

  // Advance to Championship Series
  if (matchupIndex === 0) {
    championshipSeriesMatchups[league].team1 = winningSeed;
    championshipSeriesMatchups[league].team1Id = winningTeamId;
  } else {
    championshipSeriesMatchups[league].team2 = winningSeed;
    championshipSeriesMatchups[league].team2Id = winningTeamId;
  }

  // Auto-save after each selection
  if (user.value) {
    saveBracketToDatabase();
  }
}

function advanceChampionshipSeriesWinner(league, winningSeed) {
  // Check if bracket is locked
  if (isBracketLocked.value) {
    toast.add({
      color: "red",
      title: "Bracket Locked",
      description: "Predictions are closed. The playoffs have begun!",
    });
    return;
  }

  const winningTeamId =
    league === "americanLeague"
      ? americanLeaguePlayoffs[winningSeed - 1].id
      : nationalLeaguePlayoffs[winningSeed - 1].id;

  const previousWinner = championshipSeriesMatchups[league].winner;

  championshipSeriesMatchups[league].winner = winningSeed;
  championshipSeriesMatchups[league].winnerId = winningTeamId;

  // Clear dependent selections if changing a pick
  if (previousWinner && previousWinner !== winningSeed) {
    // Clear World Series champion if it was the previous winner
    if (worldSeriesMatchup.champion === previousWinner) {
      worldSeriesMatchup.champion = null;
      worldSeriesMatchup.championId = null;
    }
  }

  worldSeriesMatchup[league] = winningSeed;
  worldSeriesMatchup[league + "Id"] = winningTeamId;

  // Auto-save after each selection
  if (user.value) {
    saveBracketToDatabase();
  }
}

function crownWorldSeriesChampion(winningSeed) {
  // Check if bracket is locked
  if (isBracketLocked.value) {
    toast.add({
      color: "red",
      title: "Bracket Locked",
      description: "Predictions are closed. The playoffs have begun!",
    });
    return;
  }

  const isAL = winningSeed === worldSeriesMatchup.americanLeague;
  const winningTeamId = isAL
    ? americanLeaguePlayoffs[winningSeed - 1].id
    : nationalLeaguePlayoffs[winningSeed - 1].id;

  worldSeriesMatchup.champion = winningSeed;
  worldSeriesMatchup.championId = winningTeamId;

  // Auto-save after each selection
  if (user.value) {
    saveBracketToDatabase();
  }
}

// Save bracket to Supabase
async function saveBracketToDatabase() {
  try {
    if (!user.value) {
      toast.add({
        color: "red",
        title: "Please login to save your bracket",
      });
      return;
    }

    const bracketData = {
      user_id: user.value.id,
      year: 2025,
      bracket_name: "My 2025 Bracket",

      // Wildcard winners (store team IDs)
      al_wildcard_1_winner:
        wildcardMatchups.americanLeague[0]?.winnerId || null,
      al_wildcard_2_winner:
        wildcardMatchups.americanLeague[1]?.winnerId || null,
      nl_wildcard_1_winner:
        wildcardMatchups.nationalLeague[0]?.winnerId || null,
      nl_wildcard_2_winner:
        wildcardMatchups.nationalLeague[1]?.winnerId || null,

      // Division Series winners (store team IDs)
      al_division_1_winner:
        divisionSeriesMatchups.americanLeague[0]?.winnerId || null,
      al_division_2_winner:
        divisionSeriesMatchups.americanLeague[1]?.winnerId || null,
      nl_division_1_winner:
        divisionSeriesMatchups.nationalLeague[0]?.winnerId || null,
      nl_division_2_winner:
        divisionSeriesMatchups.nationalLeague[1]?.winnerId || null,

      // Championship Series winners (store team IDs)
      al_championship_winner:
        championshipSeriesMatchups.americanLeague?.winnerId || null,
      nl_championship_winner:
        championshipSeriesMatchups.nationalLeague?.winnerId || null,

      // World Series champion (store team ID)
      world_series_champion: worldSeriesMatchup.championId || null,
      completed: !!worldSeriesMatchup.championId,
    };

    const { error } = await supabase
      .from("playoff_brackets")
      .upsert(bracketData, {
        onConflict: "user_id,year,bracket_name",
      });

    if (error) throw error;

    // Show toast only when completed
    if (bracketData.completed) {
      toast.add({
        color: "green",
        title: "Bracket completed and saved!",
      });
    }
  } catch (error) {
    console.error("Error saving bracket:", error);
    toast.add({
      color: "red",
      title: "Failed to save bracket",
      description: error.message,
    });
  }
}

// Load bracket from Supabase
async function loadBracketFromDatabase() {
  try {
    if (!user.value) return;

    const { data, error } = await supabase
      .from("playoff_brackets")
      .select("*")
      .eq("user_id", user.value.id)
      .eq("year", 2025)
      .eq("bracket_name", "My 2025 Bracket")
      .single();

    if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows
    if (!data) return;

    // Restore wildcard winners
    if (data.al_wildcard_1_winner) {
      const seed = americanLeaguePlayoffs.find(
        (t) => t.id === data.al_wildcard_1_winner
      )?.seed;
      if (seed) {
        wildcardMatchups.americanLeague[0].winner = seed;
        wildcardMatchups.americanLeague[0].winnerId = data.al_wildcard_1_winner;
        divisionSeriesMatchups.americanLeague[0].lower = seed; // 3v6 winner to top (index 0)
        divisionSeriesMatchups.americanLeague[0].lowerId =
          data.al_wildcard_1_winner;
      }
    }

    if (data.al_wildcard_2_winner) {
      const seed = americanLeaguePlayoffs.find(
        (t) => t.id === data.al_wildcard_2_winner
      )?.seed;
      if (seed) {
        wildcardMatchups.americanLeague[1].winner = seed;
        wildcardMatchups.americanLeague[1].winnerId = data.al_wildcard_2_winner;
        divisionSeriesMatchups.americanLeague[1].lower = seed; // 4v5 winner to bottom (index 1)
        divisionSeriesMatchups.americanLeague[1].lowerId =
          data.al_wildcard_2_winner;
      }
    }

    if (data.nl_wildcard_1_winner) {
      const seed = nationalLeaguePlayoffs.find(
        (t) => t.id === data.nl_wildcard_1_winner
      )?.seed;
      if (seed) {
        wildcardMatchups.nationalLeague[0].winner = seed;
        wildcardMatchups.nationalLeague[0].winnerId = data.nl_wildcard_1_winner;
        divisionSeriesMatchups.nationalLeague[0].lower = seed; // 3v6 winner to top (index 0)
        divisionSeriesMatchups.nationalLeague[0].lowerId =
          data.nl_wildcard_1_winner;
      }
    }

    if (data.nl_wildcard_2_winner) {
      const seed = nationalLeaguePlayoffs.find(
        (t) => t.id === data.nl_wildcard_2_winner
      )?.seed;
      if (seed) {
        wildcardMatchups.nationalLeague[1].winner = seed;
        wildcardMatchups.nationalLeague[1].winnerId = data.nl_wildcard_2_winner;
        divisionSeriesMatchups.nationalLeague[1].lower = seed; // 4v5 winner to bottom (index 1)
        divisionSeriesMatchups.nationalLeague[1].lowerId =
          data.nl_wildcard_2_winner;
      }
    }

    // Restore division series winners
    if (data.al_division_1_winner) {
      const seed = americanLeaguePlayoffs.find(
        (t) => t.id === data.al_division_1_winner
      )?.seed;
      if (seed) {
        divisionSeriesMatchups.americanLeague[0].winner = seed;
        divisionSeriesMatchups.americanLeague[0].winnerId =
          data.al_division_1_winner;
        championshipSeriesMatchups.americanLeague.team1 = seed;
        championshipSeriesMatchups.americanLeague.team1Id =
          data.al_division_1_winner;
      }
    }

    if (data.al_division_2_winner) {
      const seed = americanLeaguePlayoffs.find(
        (t) => t.id === data.al_division_2_winner
      )?.seed;
      if (seed) {
        divisionSeriesMatchups.americanLeague[1].winner = seed;
        divisionSeriesMatchups.americanLeague[1].winnerId =
          data.al_division_2_winner;
        championshipSeriesMatchups.americanLeague.team2 = seed;
        championshipSeriesMatchups.americanLeague.team2Id =
          data.al_division_2_winner;
      }
    }

    if (data.nl_division_1_winner) {
      const seed = nationalLeaguePlayoffs.find(
        (t) => t.id === data.nl_division_1_winner
      )?.seed;
      if (seed) {
        divisionSeriesMatchups.nationalLeague[0].winner = seed;
        divisionSeriesMatchups.nationalLeague[0].winnerId =
          data.nl_division_1_winner;
        championshipSeriesMatchups.nationalLeague.team1 = seed;
        championshipSeriesMatchups.nationalLeague.team1Id =
          data.nl_division_1_winner;
      }
    }

    if (data.nl_division_2_winner) {
      const seed = nationalLeaguePlayoffs.find(
        (t) => t.id === data.nl_division_2_winner
      )?.seed;
      if (seed) {
        divisionSeriesMatchups.nationalLeague[1].winner = seed;
        divisionSeriesMatchups.nationalLeague[1].winnerId =
          data.nl_division_2_winner;
        championshipSeriesMatchups.nationalLeague.team2 = seed;
        championshipSeriesMatchups.nationalLeague.team2Id =
          data.nl_division_2_winner;
      }
    }

    // Restore championship series winners
    if (data.al_championship_winner) {
      const seed = americanLeaguePlayoffs.find(
        (t) => t.id === data.al_championship_winner
      )?.seed;
      if (seed) {
        championshipSeriesMatchups.americanLeague.winner = seed;
        championshipSeriesMatchups.americanLeague.winnerId =
          data.al_championship_winner;
        worldSeriesMatchup.americanLeague = seed;
        worldSeriesMatchup.americanLeagueId = data.al_championship_winner;
      }
    }

    if (data.nl_championship_winner) {
      const seed = nationalLeaguePlayoffs.find(
        (t) => t.id === data.nl_championship_winner
      )?.seed;
      if (seed) {
        championshipSeriesMatchups.nationalLeague.winner = seed;
        championshipSeriesMatchups.nationalLeague.winnerId =
          data.nl_championship_winner;
        worldSeriesMatchup.nationalLeague = seed;
        worldSeriesMatchup.nationalLeagueId = data.nl_championship_winner;
      }
    }

    // Restore World Series champion
    if (data.world_series_champion) {
      const alSeed = americanLeaguePlayoffs.find(
        (t) => t.id === data.world_series_champion
      )?.seed;
      const nlSeed = nationalLeaguePlayoffs.find(
        (t) => t.id === data.world_series_champion
      )?.seed;
      const seed = alSeed || nlSeed;
      if (seed) {
        worldSeriesMatchup.champion = seed;
        worldSeriesMatchup.championId = data.world_series_champion;
      }
    }
  } catch (error) {
    console.error("Error loading bracket:", error);
    toast.add({
      color: "red",
      title: "Failed to load bracket",
      description: error.message,
    });
  }
}

await useAsyncData(() => {
  loadBracketFromDatabase();
});
</script>

<template>
  <div class="container mx-auto py-8 lg:py-12 mt-4 lg:mt-8 px-4">
    <!-- Page Title -->
    <div class="text-center mb-8 lg:mb-12">
      <h1 class="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
        2025 MLB Postseason Bracket
      </h1>
      <p class="text-gray-600" v-if="!isBracketLocked">
        Click on teams to advance them through the bracket
      </p>

      <!-- Countdown Timer or Lock Message -->
      <div
        v-if="isBracketLocked"
        class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
      >
        <div class="flex items-center justify-center gap-2 text-red-700">
          <UIcon name="i-heroicons-lock-closed" class="w-5 h-5" />
          <span class="font-semibold"
            >Bracket Locked - Playoffs Have Begun!</span
          >
        </div>
      </div>

      <div
        v-else
        class="mt-4 p-4 bg-blue-100 border border-blue-200 rounded-lg"
      >
        <p class="text-sm text-blue-600 mb-2">
          Time until first game (Sept 30, 1:08 PM EST)
        </p>
        <div class="flex justify-center gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-900">
              {{ timeRemaining.days }}
            </div>
            <div class="text-xs text-blue-600">DAYS</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-900">
              {{ timeRemaining.hours }}
            </div>
            <div class="text-xs text-blue-600">HOURS</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-900">
              {{ timeRemaining.minutes }}
            </div>
            <div class="text-xs text-blue-600">MINUTES</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-900">
              {{ timeRemaining.seconds }}
            </div>
            <div class="text-xs text-blue-600">SECONDS</div>
          </div>
        </div>
        <p class="text-xs text-blue-500 mt-2">
          Make your predictions before the deadline!
        </p>
      </div>

      <!-- Points System Info -->
      <div
        class="mt-4 lg:mt-6 p-3 lg:p-4 bg-gray-50 border border-gray-200 rounded-lg"
      >
        <h3 class="text-xs lg:text-sm font-semibold text-gray-900 mb-2">
          <UIcon
            name="i-heroicons-trophy"
            class="w-3 h-3 lg:w-4 lg:h-4 inline mr-1"
          />
          Point System
        </h3>
        <div
          class="grid grid-cols-2 lg:flex lg:flex-wrap justify-center gap-2 lg:gap-4"
        >
          <div
            class="flex flex-col sm:flex-row items-center gap-0 sm:gap-1 text-center sm:text-left"
          >
            <span class="font-semibold text-gray-700 text-xs sm:text-sm"
              >Wild Card:</span
            >
            <span class="text-gray-600 text-xs sm:text-sm">10 pts</span>
          </div>
          <div
            class="flex flex-col sm:flex-row items-center gap-0 sm:gap-1 text-center sm:text-left"
          >
            <span class="font-semibold text-gray-700 text-xs sm:text-sm"
              >Division Series:</span
            >
            <span class="text-gray-600 text-xs sm:text-sm">20 pts</span>
          </div>
          <div
            class="flex flex-col sm:flex-row items-center gap-0 sm:gap-1 text-center sm:text-left"
          >
            <span class="font-semibold text-gray-700 text-xs sm:text-sm"
              >Championship:</span
            >
            <span class="text-gray-600 text-xs sm:text-sm">30 pts</span>
          </div>
          <div
            class="flex flex-col sm:flex-row items-center gap-0 sm:gap-1 text-center sm:text-left"
          >
            <span class="font-semibold text-gray-700 text-xs sm:text-sm"
              >World Series:</span
            >
            <span class="text-gray-600 text-xs sm:text-sm">40 pts</span>
          </div>
        </div>
        <p class="text-center text-xs text-gray-500 mt-2">
          Points are awarded for each correct winner prediction
        </p>
      </div>
    </div>

    <!-- Desktop: 7 columns, Mobile: Single column with sections -->
    <div class="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-2 mt-8">
      <!-- AL Wild Card -->
      <div class="flex flex-col justify-center">
        <div
          class="text-center font-semibold text-gray-700 text-xs lg:text-sm mb-2 lg:mb-4"
        >
          AL Wild Card
        </div>
        <div
          class="flex flex-row lg:flex-col gap-6 lg:gap-8 justify-center items-center lg:justify-center"
        >
          <div
            class="flex flex-col gap-2 lg:gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50"
            v-for="matchup in wildcardMatchups.americanLeague"
          >
            <UAvatar
              :src="`https://www.mlbstatic.com/team-logos/${
                americanLeaguePlayoffs[matchup.higher - 1].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md transition-all ${
                  !isBracketLocked
                    ? 'hover:shadow-lg cursor-pointer'
                    : 'cursor-not-allowed opacity-90'
                } ${
                  matchup.winner === matchup.higher
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="americanLeaguePlayoffs[matchup.higher - 1].name"
              size="3xl"
              @click="
                advanceWildcardWinner(
                  'americanLeague',
                  wildcardMatchups.americanLeague.indexOf(matchup),
                  matchup.higher
                )
              "
            />
            <UAvatar
              :src="`https://www.mlbstatic.com/team-logos/${
                americanLeaguePlayoffs[matchup.lower - 1].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md transition-all ${
                  !isBracketLocked
                    ? 'hover:shadow-lg cursor-pointer'
                    : 'cursor-not-allowed opacity-90'
                } ${
                  matchup.winner === matchup.lower
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="americanLeaguePlayoffs[matchup.lower - 1].name"
              size="3xl"
              @click="
                advanceWildcardWinner(
                  'americanLeague',
                  wildcardMatchups.americanLeague.indexOf(matchup),
                  matchup.lower
                )
              "
            />
          </div>
        </div>
      </div>
      <!-- ALDS -->
      <div class="flex flex-col justify-center">
        <div
          class="text-center font-semibold text-gray-700 text-xs lg:text-sm mb-2 lg:mb-4 mt-6 lg:mt-0"
        >
          AL Division Series
        </div>
        <div
          class="flex flex-row lg:flex-col gap-6 lg:gap-8 justify-center items-center lg:justify-center"
        >
          <div
            class="flex flex-col gap-2 lg:gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50"
            v-for="(matchup, index) in divisionSeriesMatchups.americanLeague"
            :key="`alds-${index}`"
          >
            <!-- Higher seed -->
            <UAvatar
              :src="`https://www.mlbstatic.com/team-logos/${
                americanLeaguePlayoffs[matchup.higher - 1].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md transition-all ${
                  !isBracketLocked
                    ? 'hover:shadow-lg cursor-pointer'
                    : 'cursor-not-allowed opacity-90'
                } ${
                  matchup.winner === matchup.higher
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="americanLeaguePlayoffs[matchup.higher - 1].name"
              size="3xl"
              @click="
                matchup.lower &&
                  advanceDivisionSeriesWinner(
                    'americanLeague',
                    index,
                    matchup.higher
                  )
              "
            />
            <!-- Lower seed (wildcard winner) -->
            <UAvatar
              v-if="matchup.lower"
              :src="`https://www.mlbstatic.com/team-logos/${
                americanLeaguePlayoffs[matchup.lower - 1].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md transition-all ${
                  !isBracketLocked
                    ? 'hover:shadow-lg cursor-pointer'
                    : 'cursor-not-allowed opacity-90'
                } ${
                  matchup.winner === matchup.lower
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="americanLeaguePlayoffs[matchup.lower - 1].name"
              size="3xl"
              @click="
                advanceDivisionSeriesWinner(
                  'americanLeague',
                  index,
                  matchup.lower
                )
              "
            />
            <UAvatar
              v-else
              :ui="{
                root: 'bg-white/75 p-2 shadow-md',
                image: 'object-contain rounded-none',
              }"
              size="3xl"
            />
          </div>
        </div>
      </div>

      <!-- ALCS -->
      <div class="flex flex-col justify-center">
        <div
          class="text-center font-semibold text-gray-700 text-xs lg:text-sm mb-2 lg:mb-4 mt-6 lg:mt-0"
        >
          ALCS
        </div>
        <div
          class="flex flex-row lg:flex-col gap-6 lg:gap-4 justify-center items-center"
        >
          <div
            class="flex flex-col gap-2 lg:gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50"
          >
            <!-- ALCS Team 1 -->
            <UAvatar
              v-if="championshipSeriesMatchups.americanLeague.team1"
              :src="`https://www.mlbstatic.com/team-logos/${
                americanLeaguePlayoffs[
                  championshipSeriesMatchups.americanLeague.team1 - 1
                ].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                  championshipSeriesMatchups.americanLeague.winner ===
                  championshipSeriesMatchups.americanLeague.team1
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="
                americanLeaguePlayoffs[
                  championshipSeriesMatchups.americanLeague.team1 - 1
                ].name
              "
              size="3xl"
              @click="
                championshipSeriesMatchups.americanLeague.team2 &&
                  advanceChampionshipSeriesWinner(
                    'americanLeague',
                    championshipSeriesMatchups.americanLeague.team1
                  )
              "
            />
            <UAvatar
              v-else
              :ui="{
                root: 'bg-white/75 p-2 shadow-md',
                image: 'object-contain rounded-none',
              }"
              size="3xl"
            />

            <!-- ALCS Team 2 -->
            <UAvatar
              v-if="championshipSeriesMatchups.americanLeague.team2"
              :src="`https://www.mlbstatic.com/team-logos/${
                americanLeaguePlayoffs[
                  championshipSeriesMatchups.americanLeague.team2 - 1
                ].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                  championshipSeriesMatchups.americanLeague.winner ===
                  championshipSeriesMatchups.americanLeague.team2
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="
                americanLeaguePlayoffs[
                  championshipSeriesMatchups.americanLeague.team2 - 1
                ].name
              "
              size="3xl"
              @click="
                championshipSeriesMatchups.americanLeague.team1 &&
                  advanceChampionshipSeriesWinner(
                    'americanLeague',
                    championshipSeriesMatchups.americanLeague.team2
                  )
              "
            />
            <UAvatar
              v-else
              :ui="{
                root: 'bg-white/75 p-2 shadow-md',
                image: 'object-contain rounded-none',
              }"
              size="3xl"
            />
          </div>
        </div>
      </div>

      <!-- World Series -->
      <div class="flex flex-col justify-center">
        <div
          class="text-center font-semibold text-gray-700 text-xs lg:text-sm mb-2 lg:mb-4 mt-6 lg:mt-0"
        >
          World Series
        </div>
        <div
          class="flex flex-row lg:flex-col gap-6 lg:gap-8 justify-center items-center lg:justify-center"
        >
          <div
            class="flex flex-col gap-2 lg:gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50"
          >
            <!-- AL Champion -->
            <UAvatar
              v-if="worldSeriesMatchup.americanLeague"
              :src="`https://www.mlbstatic.com/team-logos/${
                americanLeaguePlayoffs[worldSeriesMatchup.americanLeague - 1].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                  worldSeriesMatchup.champion ===
                  worldSeriesMatchup.americanLeague
                    ? 'bg-yellow-100 ring-2 ring-yellow-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="
                americanLeaguePlayoffs[worldSeriesMatchup.americanLeague - 1]
                  .name
              "
              size="3xl"
              @click="
                worldSeriesMatchup.nationalLeague &&
                  crownWorldSeriesChampion(worldSeriesMatchup.americanLeague)
              "
            />
            <UAvatar
              v-else
              :ui="{
                root: 'bg-white/75 p-2 shadow-md',
                image: 'object-contain rounded-none',
              }"
              size="3xl"
            />

            <!-- NL Champion -->
            <UAvatar
              v-if="worldSeriesMatchup.nationalLeague"
              :src="`https://www.mlbstatic.com/team-logos/${
                nationalLeaguePlayoffs[worldSeriesMatchup.nationalLeague - 1].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                  worldSeriesMatchup.champion ===
                  worldSeriesMatchup.nationalLeague
                    ? 'bg-yellow-100 ring-2 ring-yellow-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="
                nationalLeaguePlayoffs[worldSeriesMatchup.nationalLeague - 1]
                  .name
              "
              size="3xl"
              @click="
                worldSeriesMatchup.americanLeague &&
                  crownWorldSeriesChampion(worldSeriesMatchup.nationalLeague)
              "
            />
            <UAvatar
              v-else
              :ui="{
                root: 'bg-white/75 p-2 shadow-md',
                image: 'object-contain rounded-none',
              }"
              size="3xl"
            />
          </div>
        </div>
      </div>

      <!-- NLCS -->
      <div class="flex flex-col justify-center">
        <div
          class="text-center font-semibold text-gray-700 text-xs lg:text-sm mb-2 lg:mb-4 mt-6 lg:mt-0"
        >
          NLCS
        </div>
        <div
          class="flex flex-row lg:flex-col gap-6 lg:gap-4 justify-center items-center"
        >
          <div
            class="flex flex-col gap-2 lg:gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50"
          >
            <!-- NLCS Team 1 -->
            <UAvatar
              v-if="championshipSeriesMatchups.nationalLeague.team1"
              :src="`https://www.mlbstatic.com/team-logos/${
                nationalLeaguePlayoffs[
                  championshipSeriesMatchups.nationalLeague.team1 - 1
                ].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                  championshipSeriesMatchups.nationalLeague.winner ===
                  championshipSeriesMatchups.nationalLeague.team1
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="
                nationalLeaguePlayoffs[
                  championshipSeriesMatchups.nationalLeague.team1 - 1
                ].name
              "
              size="3xl"
              @click="
                championshipSeriesMatchups.nationalLeague.team2 &&
                  advanceChampionshipSeriesWinner(
                    'nationalLeague',
                    championshipSeriesMatchups.nationalLeague.team1
                  )
              "
            />
            <UAvatar
              v-else
              :ui="{
                root: 'bg-white/75 p-2 shadow-md',
                image: 'object-contain rounded-none',
              }"
              size="3xl"
            />

            <!-- NLCS Team 2 -->
            <UAvatar
              v-if="championshipSeriesMatchups.nationalLeague.team2"
              :src="`https://www.mlbstatic.com/team-logos/${
                nationalLeaguePlayoffs[
                  championshipSeriesMatchups.nationalLeague.team2 - 1
                ].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md hover:shadow-lg transition-all cursor-pointer ${
                  championshipSeriesMatchups.nationalLeague.winner ===
                  championshipSeriesMatchups.nationalLeague.team2
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="
                nationalLeaguePlayoffs[
                  championshipSeriesMatchups.nationalLeague.team2 - 1
                ].name
              "
              size="3xl"
              @click="
                championshipSeriesMatchups.nationalLeague.team1 &&
                  advanceChampionshipSeriesWinner(
                    'nationalLeague',
                    championshipSeriesMatchups.nationalLeague.team2
                  )
              "
            />
            <UAvatar
              v-else
              :ui="{
                root: 'bg-white/75 p-2 shadow-md',
                image: 'object-contain rounded-none',
              }"
              size="3xl"
            />
          </div>
        </div>
      </div>

      <!-- NLDS -->
      <div class="flex flex-col justify-center">
        <div
          class="text-center font-semibold text-gray-700 text-xs lg:text-sm mb-2 lg:mb-4 mt-6 lg:mt-0"
        >
          NL Division Series
        </div>
        <div
          class="flex flex-row lg:flex-col gap-6 lg:gap-8 justify-center items-center lg:justify-center"
        >
          <div
            class="flex flex-col gap-2 lg:gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50"
            v-for="(matchup, index) in divisionSeriesMatchups.nationalLeague"
            :key="`nlds-${index}`"
          >
            <!-- Higher seed -->
            <UAvatar
              :src="`https://www.mlbstatic.com/team-logos/${
                nationalLeaguePlayoffs[matchup.higher - 1].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md transition-all ${
                  !isBracketLocked
                    ? 'hover:shadow-lg cursor-pointer'
                    : 'cursor-not-allowed opacity-90'
                } ${
                  matchup.winner === matchup.higher
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="nationalLeaguePlayoffs[matchup.higher - 1].name"
              size="3xl"
              @click="
                matchup.lower &&
                  advanceDivisionSeriesWinner(
                    'nationalLeague',
                    index,
                    matchup.higher
                  )
              "
            />
            <!-- Lower seed (wildcard winner) -->
            <UAvatar
              v-if="matchup.lower"
              :src="`https://www.mlbstatic.com/team-logos/${
                nationalLeaguePlayoffs[matchup.lower - 1].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md transition-all ${
                  !isBracketLocked
                    ? 'hover:shadow-lg cursor-pointer'
                    : 'cursor-not-allowed opacity-90'
                } ${
                  matchup.winner === matchup.lower
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="nationalLeaguePlayoffs[matchup.lower - 1].name"
              size="3xl"
              @click="
                advanceDivisionSeriesWinner(
                  'nationalLeague',
                  index,
                  matchup.lower
                )
              "
            />
            <UAvatar
              v-else
              :ui="{
                root: 'bg-white/75 p-2 shadow-md',
                image: 'object-contain rounded-none',
              }"
              size="3xl"
            />
          </div>
        </div>
      </div>

      <!-- NL Wild Card -->
      <div class="flex flex-col justify-center">
        <div
          class="text-center font-semibold text-gray-700 text-xs lg:text-sm mb-2 lg:mb-4 mt-6 lg:mt-0"
        >
          NL Wild Card
        </div>
        <div
          class="flex flex-row lg:flex-col gap-6 lg:gap-8 justify-center items-center lg:justify-center"
        >
          <div
            class="flex flex-col gap-2 lg:gap-4 p-3 border border-gray-200 rounded-lg bg-gray-50"
            v-for="matchup in wildcardMatchups.nationalLeague"
          >
            <UAvatar
              :src="`https://www.mlbstatic.com/team-logos/${
                nationalLeaguePlayoffs[matchup.higher - 1].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md transition-all ${
                  !isBracketLocked
                    ? 'hover:shadow-lg cursor-pointer'
                    : 'cursor-not-allowed opacity-90'
                } ${
                  matchup.winner === matchup.higher
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="nationalLeaguePlayoffs[matchup.higher - 1].name"
              size="3xl"
              @click="
                advanceWildcardWinner(
                  'nationalLeague',
                  wildcardMatchups.nationalLeague.indexOf(matchup),
                  matchup.higher
                )
              "
            />
            <UAvatar
              :src="`https://www.mlbstatic.com/team-logos/${
                nationalLeaguePlayoffs[matchup.lower - 1].id
              }.svg`"
              :ui="{
                root: `p-2 shadow-md transition-all ${
                  !isBracketLocked
                    ? 'hover:shadow-lg cursor-pointer'
                    : 'cursor-not-allowed opacity-90'
                } ${
                  matchup.winner === matchup.lower
                    ? 'bg-blue-100 ring-2 ring-blue-500'
                    : 'bg-white/75'
                }`,
                image: 'object-contain rounded-none',
              }"
              :alt="nationalLeaguePlayoffs[matchup.lower - 1].name"
              size="3xl"
              @click="
                advanceWildcardWinner(
                  'nationalLeague',
                  wildcardMatchups.nationalLeague.indexOf(matchup),
                  matchup.lower
                )
              "
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
