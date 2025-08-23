<script setup lang="ts">
const user = useSupabaseUser();

// MLB Predictions data
type MLBPrediction = {
  id: string;
  gameId: number;
  gameDate: string;
  homeTeamId: number;
  homeTeamName?: string | null;
  awayTeamId: number;
  awayTeamName?: string | null;
  predictedHomeScore?: number | null;
  predictedAwayScore?: number | null;
  teamEdgeId?: number | null;
  teamEdgeName?: string | null;
  grade: string | null;
  summary?: string | null;
  winningTeam?: string | null;
};

import {
  CalendarDate,
  DateFormatter,
  getLocalTimeZone,
} from "@internationalized/date";

const client = useSupabaseClient();
const today = new Date().toLocaleDateString("en-US");

// Date picker for past results (default to yesterday)
const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
const selectedDateValue = shallowRef(
  new CalendarDate(
    yesterday.getFullYear(),
    yesterday.getMonth() + 1,
    yesterday.getDate()
  )
);

const df = new DateFormatter("en-US", {
  dateStyle: "medium",
});

// Fetch today's MLB predictions - order by grade descending to get the highest/best grades
const { data: topMLBGames } = await useAsyncData<MLBPrediction[]>(
  "top-mlb-games",
  async () => {
    const { data, error } = await client
      .from("gamePredictions")
      .select("*")
      .eq("gameDate", today)
      .order("grade", { ascending: false })
      .limit(3);
    if (error) throw error;
    return data;
  }
);

// Fetch selected date's MLB predictions with results
const selectedDateComputed = computed(
  () => `selected-date-${selectedDateValue.value}`
);
const { data: selectedDayResults } = await useAsyncData<MLBPrediction[]>(
  selectedDateComputed,
  async () => {
    const { data, error } = await client
      .from("gamePredictions")
      .select("*")
      .eq(
        "gameDate",
        selectedDateValue.value
          .toDate(getLocalTimeZone())
          .toLocaleDateString("en-US") as string
      );
    if (error) throw error;
    return data;
  }
);

// Calculate selected day's results
const selectedDayCorrectPredictions = computed(() => {
  if (!selectedDayResults.value) return 0;
  return selectedDayResults.value.filter(
    (game) =>
      game.winningTeam !== null &&
      game.teamEdgeId !== null &&
      game.winningTeam === game.teamEdgeId
  ).length;
});

const selectedDayTotalGames = computed(() => {
  if (!selectedDayResults.value) return 0;
  return selectedDayResults.value.filter((game) => game.winningTeam !== null)
    .length;
});

// Mock data for the dashboard sections
const leaderboardUsers = ref([
  {
    id: 1,
    name: "johnkomarnicki",
    username: "@johnkomarnicki",
    avatar: "/api/placeholder/32/32",
    challenges: 54,
    rank: "01",
  },
  {
    id: 2,
    name: "steve2212",
    challenges: 103,
    rank: "02",
  },
  {
    id: 3,
    name: "germanov_dev",
    challenges: 81,
    rank: "03",
  },
  {
    id: 4,
    name: "reestra",
    challenges: 67,
    rank: "04",
  },
  {
    id: 5,
    name: "Luther Sherlock",
    challenges: 44,
    rank: "05",
  },
]);

const recentActivity = ref([
  {
    id: 1,
    user: "Sergio Torres",
    action: "Started the",
    target: "Subscribe Ul",
    type: "challenge",
    timeAgo: "2 days ago",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 2,
    user: "Nina Dennis",
    action: "Started the",
    target: "Subscribe Ul",
    type: "challenge",
    timeAgo: "2 days ago",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 3,
    user: "Eng_entesar",
    action: "Started the",
    target: "Coffee Landing Page",
    type: "project",
    timeAgo: "2 days ago",
    avatar: "/api/placeholder/32/32",
  },
  {
    id: 4,
    user: "Eng_entesar",
    action: "Started the",
    target: "Workout Ul",
    type: "challenge",
    timeAgo: "2 days ago",
    avatar: "/api/placeholder/32/32",
  },
]);

const recommendations = ref([
  {
    id: 1,
    title: "Subscribe Ul",
    subtitle: "Challenge",
    type: "Free",
    image: "/api/placeholder/200/150",
    color: "bg-orange-500",
  },
  {
    id: 2,
    title: "Product List With Cart",
    subtitle: "Project",
    type: "In Progress",
    image: "/api/placeholder/200/150",
    color: "bg-blue-400",
  },
  {
    id: 3,
    title: "Workout Ul",
    subtitle: "Challenge",
    type: "Free",
    image: "/api/placeholder/200/150",
    color: "bg-gray-600",
  },
  {
    id: 4,
    title: "Flight Hero Ul",
    subtitle: "Challenge",
    type: "Free",
    image: "/api/placeholder/200/150",
    color: "bg-cyan-400",
  },
]);

const correctPredictions =
  (selectedDayCorrectPredictions.value / selectedDayTotalGames.value) * 100;

// Fetch today's parlay picks from admin-created parlay
const { data: todaysParlayPicks, refresh: refreshParlay } = await useAsyncData(
  "todays-parlay",
  async () => {
    const { data, error } = await client
      .from("dailyParlayPicks")
      .select("*")
      .eq("parlayDate", today)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Error fetching parlay:", error);
    }

    return data || null;
  }
);

// Edge AI Parlay - Use admin-selected games from the parlay admin page
const parlayGames = computed(() => {
  // If admin has created a parlay, use those games
  if (todaysParlayPicks.value?.games) {
    return todaysParlayPicks.value.games.map((game: any) => ({
      id: game.id,
      matchup: game.matchup,
      pick: game.pick,
      teamId: game.teamId,
      grade: game.grade,
      confidence:
        parseFloat(game.grade || "0") <= 3
          ? "High"
          : parseFloat(game.grade || "0") <= 6
          ? "Medium"
          : "Low",
    }));
  }
  return [];
});

// Removed parlay odds since they're not accurate

const bettingSlipUrl = computed(() => {
  // Use admin-provided FanDuel link if available
  if (todaysParlayPicks.value?.fanDuelLink) {
    return todaysParlayPicks.value.fanDuelLink;
  }

  // Fallback to generic URL
  const picks = parlayGames.value.map((game) => `${game.pick}`).join(", ");
  return `https://sportsbook.fanduel.com/parlay?picks=${encodeURIComponent(
    picks
  )}`;
});

const isAdmin = computed(
  () => user.value?.email === "johnkomarnickicontact@gmail.com"
);
</script>

<template>
  <div class="grid lg:grid-cols-3 gap-4">
    <!-- Left Column: Profile & Leaderboard -->
    <div class="flex flex-col gap-4">
      <!-- Past Results -->
      <div class="grid-default-layout">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-xl text-gray-900">Model Outcomes</h3>
          <UPopover>
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-lucide-calendar"
              size="sm"
            >
              {{
                selectedDateValue
                  ? df.format(selectedDateValue.toDate(getLocalTimeZone()))
                  : "Select a date"
              }}
            </UButton>

            <template #content>
              <UCalendar v-model="selectedDateValue" class="p-2" />
            </template>
          </UPopover>
        </div>

        <div v-if="selectedDayTotalGames > 0" class="mt-4">
          <div class="flex items-center justify-between mb-3">
            <span class="text-sm text-gray-600">MLB ML Model:</span>
            <span class="text-lg font-bold text-gray-900">
              {{ selectedDayCorrectPredictions }} / {{ selectedDayTotalGames }}
            </span>
          </div>

          <UProgress v-model="correctPredictions" class="mb-2" />

          <div class="text-left">
            <span class="text-xl font-bold text-primary">
              {{
                Math.round(
                  (selectedDayCorrectPredictions / selectedDayTotalGames) * 100
                )
              }}%
            </span>
            <p class="text-xs text-gray-500 mt-1">Success Rate</p>
          </div>
        </div>

        <div v-else class="mt-4 text-center py-4 text-gray-500">
          <p class="text-sm">No results available for selected date</p>
        </div>
      </div>
    </div>

    <!-- Middle Column: MLB ML Model -->
    <div class="flex flex-col gap-4">
      <div class="grid-default-layout">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-xl text-gray-900">MLB: ML Model</h3>
          <UButton to="/mlb" color="primary" variant="outline" size="sm">
            View All Games
          </UButton>
        </div>

        <div v-if="topMLBGames && topMLBGames.length > 0" class="space-y-4">
          <div
            v-for="game in topMLBGames"
            :key="game.id"
            class="flex flex-col gap-2 border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors"
          >
            <!-- Game Header -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div>
                  <UAvatar
                    :src="`https://www.mlbstatic.com/team-logos/${game.awayTeamId}.svg`"
                    :alt="game.awayTeamName || 'Away Team'"
                    size="md"
                    :ui="{
                      root: 'bg-white/75 p-1.5',
                      image: 'object-contain rounded-none',
                    }"
                  />
                  <span class="text-sm font-medium">{{
                    game.awayTeamName
                  }}</span>
                </div>
                <span class="text-xs text-gray-500">at</span>
                <div>
                  <UAvatar
                    :src="`https://www.mlbstatic.com/team-logos/${game.homeTeamId}.svg`"
                    :alt="game.homeTeamName || 'Home Team'"
                    size="md"
                    :ui="{
                      root: 'bg-white/75 p-1.5',
                      image: 'object-contain rounded-none',
                    }"
                  />
                  <span class="text-sm font-medium">{{
                    game.homeTeamName
                  }}</span>
                </div>
              </div>
            </div>

            <UBadge
              :label="`Grade: ${game.grade || 'N/A'}`"
              variant="solid"
              size="md"
              class="self-start"
            />

            <!-- Predicted Score -->
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <span>Predicted Score:</span>
              <span class="font-semibold">
                {{ game.predictedAwayScore || 0 }} -
                {{ game.predictedHomeScore || 0 }}
              </span>
            </div>

            <!-- Projected Winner -->
            <div
              v-if="game.teamEdgeName"
              class="flex items-center gap-2 text-sm"
            >
              <span class="text-gray-600">Projected Winner:</span>
              <div class="flex items-center gap-1">
                <UAvatar
                  :src="`https://www.mlbstatic.com/team-logos/${game.teamEdgeId}.svg`"
                  :alt="game.teamEdgeName || 'Projected Winner'"
                  size="md"
                  :ui="{
                    root: 'bg-white/75 p-1.5',
                    image: 'object-contain rounded-none',
                  }"
                />
                <span class="font-medium">{{ game.teamEdgeName }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          <p>No MLB predictions available for today</p>
        </div>
      </div>
    </div>

    <!-- Right Column: Edge AI Parlay -->
    <div class="flex flex-col gap-4">
      <!-- Edge AI Parlay -->
      <div class="grid-default-layout">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-semibold text-xl text-gray-900">Edge AI Parlay</h3>
          <div class="flex items-center gap-2">
            <UBadge
              :label="`${parlayGames.length} picks`"
              color="primary"
              variant="solid"
              size="sm"
              v-if="parlayGames.length > 0"
            />
          </div>
        </div>

        <div v-if="parlayGames.length > 0" class="space-y-3">
          <div class="text-sm text-gray-600 mb-3">
            Today's AI-selected picks for optimal parlay betting:
          </div>

          <div
            v-for="(game, index) in parlayGames"
            :key="game.id"
            class="border border-gray-200 rounded-lg p-3 bg-gradient-to-r from-blue-50 to-indigo-50"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-2">
                <UBadge
                  :label="`Pick ${index + 1}`"
                  color="primary"
                  variant="outline"
                  size="xs"
                />
              </div>
              <span class="text-xs text-gray-500">Grade: {{ game.grade }}</span>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <UAvatar
                v-if="game.teamId"
                :src="`https://www.mlbstatic.com/team-logos/${game.teamId}.svg`"
                :alt="game.pick"
                size="sm"
                :ui="{
                  root: 'bg-white/75 p-1',
                  image: 'object-contain rounded-none',
                }"
              />
              <div class="flex-1">
                <div class="font-medium text-sm text-gray-900">
                  {{ game.pick }}
                </div>
                <div class="text-xs text-gray-600">{{ game.matchup }}</div>
              </div>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-3 mt-4">
            <UButton
              :to="bettingSlipUrl"
              external
              color="primary"
              variant="solid"
              size="sm"
              icon="i-lucide-external-link"
              class="w-full"
              target="_blank"
            >
              Open FanDuel Betting Slip
            </UButton>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
          <Icon
            name="i-lucide-calculator"
            class="w-8 h-8 mx-auto mb-2 opacity-50"
          />
          <p class="text-sm">No parlay available today</p>
        </div>
      </div>
    </div>
  </div>
</template>
