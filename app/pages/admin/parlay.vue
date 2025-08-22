<script setup lang="ts">
// Admin only page - protect with middleware if needed
const user = useSupabaseUser();
const client = useSupabaseClient();
const today = new Date().toLocaleDateString("en-US");

// Redirect if not admin
if (!user.value || user.value.email !== "johnkomarnickicontact@gmail.com") {
  throw createError({
    statusCode: 403,
    statusMessage: "Access Denied",
  });
}

// SEO Meta Data
useSeoMeta({
  title: "Admin - Parlay Management",
  description: "Admin interface for managing daily parlay picks",
  robots: "noindex, nofollow",
});

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
};

// Fetch today's MLB predictions - sorted by best grade first (ascending = best grades first)
const { data: todaysGames, refresh: refreshGames } = await useAsyncData<
  MLBPrediction[]
>("admin-todays-games", async () => {
  const { data, error } = await client
    .from("gamePredictions")
    .select("*")
    .eq("gameDate", today)
    .order("grade", { ascending: false }); // ascending = best grades (lowest numbers) first
  if (error) throw error;
  return data;
});

// Selected games for parlay
const selectedGames = ref<MLBPrediction[]>([]);
const fanDuelLink = ref("");
const isLoading = ref(false);

// Fetch existing parlay for today
const { data: existingParlay, refresh: refreshParlay } = await useAsyncData(
  "existing-parlay",
  async () => {
    const { data, error } = await client
      .from("dailyParlayPicks")
      .select("*")
      .eq("parlayDate", today)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Error fetching existing parlay:", error);
    }

    return data;
  }
);

// Load existing selections
watch(
  existingParlay,
  (parlay) => {
    if (parlay?.gameIds && todaysGames.value) {
      selectedGames.value = todaysGames.value.filter((game) =>
        parlay.gameIds.includes(game.id)
      );
    }
    if (parlay?.fanDuelLink) {
      fanDuelLink.value = parlay.fanDuelLink;
    }
  },
  { immediate: true }
);

// Add game to parlay
const addToParlay = (game: MLBPrediction) => {
  if (!selectedGames.value.find((g) => g.id === game.id)) {
    selectedGames.value.push(game);
  }
};

// Remove game from parlay
const removeFromParlay = (gameId: string) => {
  selectedGames.value = selectedGames.value.filter((g) => g.id !== gameId);
};

// Check if game is selected
const isSelected = (gameId: string) => {
  return selectedGames.value.some((g) => g.id === gameId);
};

// Removed parlay odds calculation since they're not accurate

// Save parlay to database
const saveParlay = async () => {
  if (selectedGames.value.length === 0) {
    alert("Please select at least one game for the parlay");
    return;
  }

  isLoading.value = true;

  try {
    const parlayData = {
      parlayDate: today,
      gameIds: selectedGames.value.map((g) => g.id),
      games: selectedGames.value.map((g) => ({
        id: g.id,
        gameId: g.gameId,
        matchup: `${g.awayTeamName} at ${g.homeTeamName}`,
        pick: g.teamEdgeName,
        teamId: g.teamEdgeId,
        grade: g.grade,
      })),
      odds: null,
      fanDuelLink: fanDuelLink.value || null,
      createdBy: user.value?.id,
      totalGames: selectedGames.value.length,
    };

    const { error } = await client.from("dailyParlayPicks").upsert(parlayData, {
      onConflict: "parlayDate",
    });

    if (error) {
      console.error("Error saving parlay:", error);
      alert("Error saving parlay: " + error.message);
    } else {
      alert("Parlay saved successfully!");
      await refreshParlay();
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Unexpected error occurred");
  } finally {
    isLoading.value = false;
  }
};

// Clear all selections
const clearSelections = () => {
  selectedGames.value = [];
  fanDuelLink.value = "";
};
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto py-8 px-4">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Parlay Management</h1>
        <p class="text-gray-600">Select games for today's Edge AI Parlay</p>
        <p class="text-sm text-blue-600 mt-1">Date: {{ today }}</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Available Games -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-sm border p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Today's MLB Predictions
            </h2>

            <div v-if="todaysGames && todaysGames.length > 0" class="space-y-3">
              <div
                v-for="game in todaysGames"
                :key="game.id"
                class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                :class="isSelected(game.id) ? 'bg-blue-50 border-blue-300' : ''"
              >
                <div class="flex items-center gap-3">
                  <UAvatar
                    :src="`https://www.mlbstatic.com/team-logos/${game.awayTeamId}.svg`"
                    :alt="game.awayTeamName || 'Away Team'"
                    size="sm"
                    :ui="{
                      root: 'bg-white/75 p-1',
                      image: 'object-contain rounded-none',
                    }"
                  />
                  <span class="text-xs text-gray-500">at</span>
                  <UAvatar
                    :src="`https://www.mlbstatic.com/team-logos/${game.homeTeamId}.svg`"
                    :alt="game.homeTeamName || 'Home Team'"
                    size="sm"
                    :ui="{
                      root: 'bg-white/75 p-1',
                      image: 'object-contain rounded-none',
                    }"
                  />
                  <div class="flex-1">
                    <div class="font-medium text-gray-900">
                      {{ game.awayTeamName }} at {{ game.homeTeamName }}
                    </div>
                    <div class="text-sm text-gray-600">
                      Pick: {{ game.teamEdgeName }} | Grade: {{ game.grade }}
                    </div>
                  </div>
                </div>

                <div class="flex items-center gap-2">
                  <UBadge
                    :label="game.grade || 'N/A'"
                    :color="
                      parseFloat(game.grade || '10') <= 3
                        ? 'success'
                        : parseFloat(game.grade || '10') <= 6
                        ? 'warning'
                        : 'error'
                    "
                    variant="soft"
                    size="sm"
                  />
                  <UButton
                    v-if="!isSelected(game.id)"
                    @click="addToParlay(game)"
                    color="primary"
                    variant="outline"
                    size="sm"
                  >
                    Add to Parlay
                  </UButton>
                  <UButton
                    v-else
                    @click="removeFromParlay(game.id)"
                    color="error"
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </UButton>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500">
              <p>No games available for today</p>
            </div>
          </div>
        </div>

        <!-- Selected Parlay -->
        <div>
          <div class="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">
                Selected Parlay
              </h2>
              <UBadge
                v-if="selectedGames.length > 0"
                :label="`${selectedGames.length} games`"
                color="primary"
                variant="solid"
                size="sm"
              />
            </div>

            <div v-if="selectedGames.length > 0" class="space-y-3 mb-6">
              <div
                v-for="(game, index) in selectedGames"
                :key="game.id"
                class="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <UBadge
                  :label="`${index + 1}`"
                  color="primary"
                  variant="solid"
                  size="xs"
                />
                <UAvatar
                  :src="`https://www.mlbstatic.com/team-logos/${game.teamEdgeId}.svg`"
                  :alt="game.teamEdgeName || 'Team'"
                  size="xs"
                  :ui="{
                    root: 'bg-white/75 p-0.5',
                    image: 'object-contain rounded-none',
                  }"
                />
                <div class="flex-1">
                  <div class="font-medium text-sm text-gray-900">
                    {{ game.teamEdgeName }}
                  </div>
                  <div class="text-xs text-gray-600">
                    Grade: {{ game.grade }}
                  </div>
                </div>
                <UButton
                  @click="removeFromParlay(game.id)"
                  color="error"
                  variant="ghost"
                  size="xs"
                  icon="i-lucide-x"
                />
              </div>
            </div>

            <div v-else class="text-center py-8 text-gray-500 mb-6">
              <Icon
                name="i-lucide-plus-circle"
                class="w-8 h-8 mx-auto mb-2 opacity-50"
              />
              <p class="text-sm">No games selected</p>
            </div>

            <!-- FanDuel Link Input -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                FanDuel Link (Optional)
              </label>
              <UInput
                v-model="fanDuelLink"
                placeholder="https://sportsbook.fanduel.com/..."
                size="sm"
                class="w-full"
              />
              <p class="text-xs text-gray-500 mt-1">
                Paste the FanDuel parlay link here
              </p>
            </div>

            <!-- Actions -->
            <div class="space-y-2">
              <UButton
                @click="saveParlay"
                :loading="isLoading"
                :disabled="selectedGames.length === 0"
                color="primary"
                variant="solid"
                size="md"
                class="w-full"
              >
                Save Parlay ({{ selectedGames.length }} games)
              </UButton>

              <UButton
                @click="clearSelections"
                :disabled="selectedGames.length === 0 && !fanDuelLink"
                color="neutral"
                variant="outline"
                size="sm"
                class="w-full"
              >
                Clear All
              </UButton>
            </div>

            <!-- Status -->
            <div
              v-if="existingParlay"
              class="mt-4 pt-4 border-t border-gray-200"
            >
              <div class="text-xs text-green-600 flex items-center gap-1">
                <Icon name="i-lucide-check-circle" class="w-3 h-3" />
                Parlay exists for today
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
