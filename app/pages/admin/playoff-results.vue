<script setup>
const supabase = useSupabaseClient();
const user = useSupabaseUser();
const toast = useToast();

// Check if user is admin
const isAdmin = computed(
  () => user.value?.email === "johnkomarnickicontact@gmail.com"
);

// Redirect if not admin
watch(isAdmin, (admin) => {
  if (!admin) {
    navigateTo("/");
  }
});

// 2025 MLB Postseason Teams
const teams = [
  // American League
  { id: 141, name: "Toronto Blue Jays", abbreviation: "TOR", league: "AL" },
  { id: 136, name: "Seattle Mariners", abbreviation: "SEA", league: "AL" },
  { id: 114, name: "Cleveland Guardians", abbreviation: "CLE", league: "AL" },
  { id: 147, name: "New York Yankees", abbreviation: "NYY", league: "AL" },
  { id: 111, name: "Boston Red Sox", abbreviation: "BOS", league: "AL" },
  { id: 116, name: "Detroit Tigers", abbreviation: "DET", league: "AL" },
  // National League
  { id: 158, name: "Milwaukee Brewers", abbreviation: "MIL", league: "NL" },
  { id: 143, name: "Philadelphia Phillies", abbreviation: "PHI", league: "NL" },
  { id: 119, name: "Los Angeles Dodgers", abbreviation: "LAD", league: "NL" },
  { id: 112, name: "Chicago Cubs", abbreviation: "CHC", league: "NL" },
  { id: 135, name: "San Diego Padres", abbreviation: "SD", league: "NL" },
  { id: 113, name: "Cincinnati Reds", abbreviation: "CIN", league: "NL" },
];

// Form state
const formData = ref({
  series_id: "",
  round: "wild_card",
  winning_team_id: null,
  losing_team_id: null,
  series_end_date: new Date().toISOString().split("T")[0],
  games_won: null,
  games_lost: null,
});

const isSubmitting = ref(false);

// Fetch existing results
const { data: existingResults, refresh: refreshResults } = await useAsyncData(
  "playoff_results",
  async () => {
    const { data, error } = await supabase
      .from("playoff_results")
      .select("*")
      .order("series_end_date", { ascending: false });

    if (error) {
      console.error("Error fetching results:", error);
      return [];
    }
    return data || [];
  }
);

// Series options grouped by round with actual team names
const seriesOptions = {
  wild_card: [
    { value: "2025-ALWC1", label: "AL Wild Card 1: Guardians (3) vs Tigers (6)" },
    { value: "2025-ALWC2", label: "AL Wild Card 2: Yankees (4) vs Red Sox (5)" },
    { value: "2025-NLWC1", label: "NL Wild Card 1: Dodgers (3) vs Reds (6)" },
    { value: "2025-NLWC2", label: "NL Wild Card 2: Cubs (4) vs Padres (5)" },
  ],
  division: [
    { value: "2025-ALDS1", label: "ALDS 1: Mariners (2) vs WC1 Winner" },
    { value: "2025-ALDS2", label: "ALDS 2: Blue Jays (1) vs WC2 Winner" },
    { value: "2025-NLDS1", label: "NLDS 1: Phillies (2) vs WC1 Winner" },
    { value: "2025-NLDS2", label: "NLDS 2: Brewers (1) vs WC2 Winner" },
  ],
  championship: [
    { value: "2025-ALCS", label: "ALCS: American League Championship" },
    { value: "2025-NLCS", label: "NLCS: National League Championship" },
  ],
  world_series: [{ value: "2025-WS", label: "World Series: AL Champion vs NL Champion" }],
};

const currentSeriesOptions = computed(() => {
  return seriesOptions[formData.value.round] || [];
});

// Map series IDs to the teams involved in that matchup
const seriesTeamMap = {
  // Wild Card
  "2025-ALWC1": [114, 116], // Guardians vs Tigers
  "2025-ALWC2": [147, 111], // Yankees vs Red Sox
  "2025-NLWC1": [119, 113], // Dodgers vs Reds
  "2025-NLWC2": [112, 135], // Cubs vs Padres
  // Division Series - initially only show top seeds, user picks wild card winners
  "2025-ALDS1": [136], // Mariners (+ WC1 winner to be selected)
  "2025-ALDS2": [141], // Blue Jays (+ WC2 winner to be selected)
  "2025-NLDS1": [143], // Phillies (+ WC1 winner to be selected)
  "2025-NLDS2": [158], // Brewers (+ WC2 winner to be selected)
  // Championship & World Series - can be any playoff team
  "2025-ALCS": [141, 136, 114, 147, 111, 116], // All AL teams
  "2025-NLCS": [158, 143, 119, 112, 135, 113], // All NL teams
  "2025-WS": [141, 136, 114, 147, 111, 116, 158, 143, 119, 112, 135, 113], // All teams
};

// Filter teams based on selected series
const availableTeams = computed(() => {
  if (!formData.value.series_id) {
    return teams; // Show all teams if no series selected
  }

  const allowedTeamIds = seriesTeamMap[formData.value.series_id] || [];
  return teams.filter(team => allowedTeamIds.includes(team.id));
});

// Watch for series_id changes and reset team selections if they're not in the new list
watch(() => formData.value.series_id, (newSeriesId, oldSeriesId) => {
  if (newSeriesId !== oldSeriesId) {
    const allowedTeamIds = seriesTeamMap[newSeriesId] || [];

    // Clear winning team if it's not in the new series
    if (formData.value.winning_team_id && !allowedTeamIds.includes(formData.value.winning_team_id)) {
      formData.value.winning_team_id = null;
    }

    // Clear losing team if it's not in the new series
    if (formData.value.losing_team_id && !allowedTeamIds.includes(formData.value.losing_team_id)) {
      formData.value.losing_team_id = null;
    }
  }
});

async function submitResult() {
  if (
    !formData.value.series_id ||
    !formData.value.winning_team_id ||
    !formData.value.losing_team_id
  ) {
    toast.add({
      color: "red",
      title: "Missing required fields",
      description: "Please fill in all required fields",
    });
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await $fetch("/api/addPlayoffResult", {
      method: "POST",
      body: formData.value,
    });

    toast.add({
      color: "green",
      title: "Success",
      description: response.message,
    });

    // Reset form
    formData.value = {
      series_id: "",
      round: "wild_card",
      winning_team_id: null,
      losing_team_id: null,
      series_end_date: new Date().toISOString().split("T")[0],
      games_won: null,
      games_lost: null,
    };

    // Refresh results list
    await refreshResults();
  } catch (error) {
    console.error("Error submitting result:", error);
    toast.add({
      color: "red",
      title: "Error",
      description: error.data?.message || "Failed to submit result",
    });
  } finally {
    isSubmitting.value = false;
  }
}

function getTeamName(teamId) {
  return teams.find((t) => t.id === teamId)?.name || `Team ${teamId}`;
}

function getRoundLabel(round) {
  const labels = {
    wild_card: "Wild Card",
    division: "Division Series",
    championship: "Championship",
    world_series: "World Series",
  };
  return labels[round] || round;
}
</script>

<template>
  <div class="container mx-auto py-8 px-4">
    <div v-if="!isAdmin" class="text-center py-12">
      <h1 class="text-2xl font-bold text-red-600">Access Denied</h1>
      <p class="text-gray-600 mt-2">Admin access required</p>
    </div>

    <div v-else>
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        Manage Playoff Results
      </h1>

      <!-- Form to add/update results -->
      <div class="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Add/Update Series Result
        </h2>

        <form @submit.prevent="submitResult" class="space-y-4">
          <!-- Round Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Round
            </label>
            <select
              v-model="formData.round"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="wild_card">Wild Card</option>
              <option value="division">Division Series</option>
              <option value="championship">Championship Series</option>
              <option value="world_series">World Series</option>
            </select>
          </div>

          <!-- Series Selection -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Series
            </label>
            <select
              v-model="formData.series_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a series</option>
              <option
                v-for="series in currentSeriesOptions"
                :key="series.value"
                :value="series.value"
              >
                {{ series.label }}
              </option>
            </select>
          </div>

          <!-- Winning Team -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Winning Team
            </label>
            <select
              v-model.number="formData.winning_team_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              :disabled="!formData.series_id"
            >
              <option :value="null">
                {{ formData.series_id ? 'Select winning team' : 'Select series first' }}
              </option>
              <option v-for="team in availableTeams" :key="team.id" :value="team.id">
                {{ team.name }} ({{ team.abbreviation }})
              </option>
            </select>
          </div>

          <!-- Losing Team -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Losing Team
            </label>
            <select
              v-model.number="formData.losing_team_id"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
              :disabled="!formData.series_id"
            >
              <option :value="null">
                {{ formData.series_id ? 'Select losing team' : 'Select series first' }}
              </option>
              <option v-for="team in availableTeams" :key="team.id" :value="team.id">
                {{ team.name }} ({{ team.abbreviation }})
              </option>
            </select>
          </div>

          <!-- Series End Date -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Series End Date
            </label>
            <input
              v-model="formData.series_end_date"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <!-- Optional: Series Score -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Winner's Wins (Optional)
              </label>
              <input
                v-model.number="formData.games_won"
                type="number"
                min="0"
                max="4"
                placeholder="e.g., 2"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Winner's Losses (Optional)
              </label>
              <input
                v-model.number="formData.games_lost"
                type="number"
                min="0"
                max="3"
                placeholder="e.g., 1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <p class="text-xs text-gray-500 -mt-2">
            Enter the series score (e.g., 2-1 means winner won 2 games, lost 1 game)
          </p>

          <!-- Submit Button -->
          <UButton
            type="submit"
            :loading="isSubmitting"
            :disabled="isSubmitting"
            block
          >
            {{
              isSubmitting ? "Submitting..." : "Submit Result & Score Brackets"
            }}
          </UButton>
        </form>
      </div>

      <!-- Existing Results -->
      <div class="bg-white p-6 rounded-lg border border-gray-200">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">
          Existing Results
        </h2>

        <div
          v-if="!existingResults || existingResults.length === 0"
          class="text-gray-500"
        >
          No results entered yet
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="result in existingResults"
            :key="result.series_id"
            class="p-4 border border-gray-200 rounded-lg flex items-center justify-between"
          >
            <div>
              <div class="flex items-center gap-3 mb-1">
                <span class="font-semibold text-gray-900">{{
                  result.series_id
                }}</span>
                <span
                  class="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded"
                >
                  {{ getRoundLabel(result.round) }}
                </span>
              </div>
              <div class="flex items-center gap-2 text-sm text-gray-700">
                <UAvatar
                  :src="`https://www.mlbstatic.com/team-logos/${result.winning_team_id}.svg`"
                  size="xs"
                  :ui="{ image: 'object-contain rounded-none' }"
                />
                <span class="font-medium">{{
                  getTeamName(result.winning_team_id)
                }}</span>
                <span class="text-gray-500">defeats</span>
                <UAvatar
                  :src="`https://www.mlbstatic.com/team-logos/${result.losing_team_id}.svg`"
                  size="xs"
                  :ui="{ image: 'object-contain rounded-none' }"
                />
                <span>{{ getTeamName(result.losing_team_id) }}</span>
                <span
                  v-if="result.games_won && result.games_lost"
                  class="text-gray-500"
                >
                  ({{ result.games_won }}-{{ result.games_lost }})
                </span>
              </div>
            </div>
            <div class="text-xs text-gray-500">
              {{ new Date(result.series_end_date).toLocaleDateString() }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
