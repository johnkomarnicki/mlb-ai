<script setup lang="ts">
import type { TableColumn, TableRow } from "@nuxt/ui";

const UAvatar = resolveComponent("UAvatar");
const ULink = resolveComponent("ULink");
const UButton = resolveComponent("UButton");

const user = useSupabaseUser();

// Show different content based on authentication status
const isAuthenticated = computed(() => !!user.value);

type MLBData = {
  id: string; // uuid
  gameId: number;
  gameDate: string; // ISO date string (e.g., "2025-06-10")
  homeTeamId: number;
  homeTeamName?: string | null;
  awayTeamId: number;
  awayTeamName?: string | null;
  predictedHomeScore?: number | null;
  predictedAwayScore?: number | null;
  predictedTotalScore?: number | null;
  teamEdgeId?: number | null;
  teamEdgeName?: string | null;
  createdAt?: string | null; // ISO timestamp (e.g., "2025-06-10T14:30:00Z")
  summary?: string | null;
  grade: string | null;
};

const client = useSupabaseClient();
const today = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD

// Only fetch data if user is authenticated
const { data: mlbData, error: mlbError } = await useAsyncData<MLBData[]>(
  async () => {
    if (!isAuthenticated.value) return [];
    
    const { data, error } = await client
      .from("gamePredictions")
      .select("*")
      .eq("gameDate", today as string)
      .order("grade", {
        ascending: true,
      });
    if (error) throw error;
    return data;
  },
  {
    default: () => [],
    watch: [isAuthenticated]
  }
);

const columns: TableColumn<MLBData>[] = [
  {
    accessorKey: "home_team",
    header: "Matchup",
    cell: ({ row }) => {
      return h("div", { class: "flex flex-1 items-center gap-3" }, [
        h("div", { class: "font-bold flex items-center gap-3" }, [
          h(UAvatar, {
            src: `https://www.mlbstatic.com/team-logos/${row.original.awayTeamId}.svg`,
            ui: {
              root: "bg-white/75 p-1.5",
              image: "object-contain rounded-none",
            },
            alt: row.original.homeTeamName,
            size: "lg",
          }),
          h("p", { class: " text-dire-wolf" }, row.original.awayTeamName!),
          h("span", { class: " text-dire-wolf" }, "at"),
          h(UAvatar, {
            src: `https://www.mlbstatic.com/team-logos/${row.original.homeTeamId}.svg`,
            ui: {
              root: "bg-white/75 p-1.5",
              image: "object-contain rounded-none",
            },
            alt: row.original.homeTeamName,
            size: "lg",
          }),
          h("p", { class: " text-dire-wolf" }, row.original.homeTeamName!),
        ]),
      ]);
    },
  },
  {
    accessorKey: "predicted_total",
    header: "Projected Score",
    cell: ({ row }) => {
      return h("div", { class: "flex flex-1 items-center gap-3" }, [
        h("div", { class: "flex items-center gap-3" }, [
          h(UAvatar, {
            src: `https://www.mlbstatic.com/team-logos/${row.original.awayTeamId}.svg`,
            ui: {
              root: "bg-white/75 p-1.5",
              image: "object-contain rounded-none",
            },
            alt: row.original.awayTeamName,
            size: "lg",
          }),
          h(
            "p",
            { class: "font-bold text-dire-wolf" },
            row.original.predictedAwayScore!
          ),
          h("span", "-"),
          h(
            "p",
            { class: "font-bold text-dire-wolf" },
            row.original.predictedHomeScore!
          ),
          h(UAvatar, {
            src: `https://www.mlbstatic.com/team-logos/${row.original.homeTeamId}.svg`,
            ui: {
              root: "bg-white/75 p-1.5",
              image: "object-contain rounded-none",
            },
            alt: row.original.homeTeamName,
            size: "lg",
          }),
        ]),
      ]);
    },
  },
  {
    accessorKey: "predicted_total",
    header: "Projected Total",
    cell: ({ row }) => {
      return h("div", { class: "flex flex-1 items-center gap-3" }, [
        h("div", { class: "flex items-center gap-3" }, [
          h(
            "p",
            { class: "font-bold text-dire-wolf" },
            row.original.predictedHomeScore! + row.original.predictedAwayScore!
          ),
        ]),
      ]);
    },
  },
  {
    accessorKey: "edge_note",
    header: "Winning Team",
    cell: ({ row }) => {
      return h("div", { class: "flex flex-1 items-center gap-3" }, [
        h("div", { class: "flex items-center gap-3" }, [
          h(UAvatar, {
            src: `https://www.mlbstatic.com/team-logos/${row.original.teamEdgeId}.svg`,
            ui: {
              root: "bg-white/75 p-1.5",
              image: "object-contain rounded-none",
            },
            alt: row.original.awayTeamName,
            size: "lg",
          }),
          h(
            "p",
            { class: "font-bold text-dire-wolf" },
            row.original.teamEdgeName!
          ),
        ]),
      ]);
    },
  },
  {
    accessorKey: "edge_note",
    header: "AI Grade",
    cell: ({ row }) => {
      return h("div", { class: "flex flex-1 items-center gap-3" }, [
        h("div", { class: "flex items-center gap-3" }, [
          h("p", { class: "font-bold text-dire-wolf" }, row.original.grade!),
        ]),
      ]);
    },
  },
];

const gameInsight = ref(false);
const selectedRow = ref<MLBData | undefined>(undefined);
function doSomething(row: TableRow<MLBData>, e?: Event) {
  selectedRow.value = row.original;
  gameInsight.value = true;
}

// Features data
const features = [
  {
    icon: "i-mdi-brain",
    title: "Advanced AI Models",
    description: "Our proprietary machine learning algorithms analyze thousands of data points to generate accurate predictions."
  },
  {
    icon: "i-mdi-chart-line",
    title: "Data-Driven Insights",
    description: "Every prediction is backed by comprehensive statistical analysis and historical performance data."
  },
  {
    icon: "i-mdi-target",
    title: "High Accuracy",
    description: "Our models consistently deliver superior performance with transparent accuracy tracking."
  },
  {
    icon: "i-mdi-clock-fast",
    title: "Real-Time Updates",
    description: "Get the latest predictions and insights updated in real-time as new data becomes available."
  }
];

const stats = [
  { value: "85%", label: "Prediction Accuracy" },
  { value: "10K+", label: "Games Analyzed" },
  { value: "24/7", label: "Model Updates" },
  { value: "5+", label: "Sports Covered" }
];
</script>

<template>
  <!-- Game Insight Modal -->
  <UModal
    v-model:open="gameInsight"
    :ui="{
      content: 'p-10 max-w-2xl',
    }"
  >
    <template #content>
      <div class="border-none flex items-center mb-2">
        <h1 class="text-xl">
          <span class="font-bold"> {{ selectedRow?.awayTeamName }} </span>
          at
          <span class="font-bold"> {{ selectedRow?.homeTeamName }} </span>
        </h1>
        <p class="ml-auto">
          AI Grade: <span class="font-bold">{{ selectedRow?.grade }}</span>
        </p>
      </div>
      <h2 class="text-lg mb-2 border-none">Game Analysis</h2>
      <div
        class="prose text-white lg:prose-sm"
        v-html="selectedRow?.summary"
      ></div>
    </template>
  </UModal>

  <div v-if="!isAuthenticated">
    <!-- Landing Page for Non-Authenticated Users -->
    
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-dodgeroll-gold-900 via-dire-wolf to-dodgeroll-gold-800 text-white">
      <div class="absolute inset-0 bg-black/20"></div>
      <div class="relative container mx-auto px-8 py-20 lg:py-32">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
            Edge AI Sports Models
          </h1>
          <p class="text-xl lg:text-2xl mb-8 text-dodgeroll-gold-100 leading-relaxed">
            Revolutionizing sports betting with cutting-edge AI technology and data-driven predictions
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <UButton 
              to="/login" 
              size="xl" 
              color="primary" 
              class="bg-dodgeroll-gold-500 hover:bg-dodgeroll-gold-400 text-white font-bold px-8 py-4"
            >
              Get Started Today
            </UButton>
            <UButton 
              size="xl" 
              variant="outline" 
              class="border-white text-white hover:bg-white hover:text-dire-wolf font-bold px-8 py-4"
              @click="$el.scrollIntoView({ behavior: 'smooth', block: 'start' })"
            >
              Learn More
            </UButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-dodgeroll-gold-600 mb-2">
              {{ stat.value }}
            </div>
            <div class="text-gray-600 font-medium">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20 bg-gray-50">
      <div class="container mx-auto px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-dire-wolf mb-6">
            Why Choose Edge AI?
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Our advanced AI models process vast amounts of data to deliver the most accurate sports predictions in the industry
          </p>
        </div>
        
        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div v-for="feature in features" :key="feature.title" class="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div class="w-16 h-16 bg-dodgeroll-gold-100 rounded-lg flex items-center justify-center mb-6">
              <UIcon :name="feature.icon" class="text-3xl text-dodgeroll-gold-600" />
            </div>
            <h3 class="text-xl font-bold text-dire-wolf mb-4">{{ feature.title }}</h3>
            <p class="text-gray-600 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-dire-wolf mb-6">
            How It Works
          </h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Our three-step process delivers accurate, data-driven sports predictions
          </p>
        </div>
        
        <div class="grid lg:grid-cols-3 gap-12">
          <div class="text-center">
            <div class="w-20 h-20 bg-dodgeroll-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-white">1</span>
            </div>
            <h3 class="text-2xl font-bold text-dire-wolf mb-4">Data Collection</h3>
            <p class="text-gray-600 leading-relaxed">
              We gather comprehensive data from multiple sources including player statistics, team performance, weather conditions, and historical matchups.
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-20 h-20 bg-dodgeroll-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-white">2</span>
            </div>
            <h3 class="text-2xl font-bold text-dire-wolf mb-4">AI Analysis</h3>
            <p class="text-gray-600 leading-relaxed">
              Our advanced machine learning models process thousands of data points to identify patterns and generate accurate predictions.
            </p>
          </div>
          
          <div class="text-center">
            <div class="w-20 h-20 bg-dodgeroll-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-2xl font-bold text-white">3</span>
            </div>
            <h3 class="text-2xl font-bold text-dire-wolf mb-4">Predictions Delivered</h3>
            <p class="text-gray-600 leading-relaxed">
              Receive detailed predictions with confidence ratings, analysis summaries, and actionable insights for informed betting decisions.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-dodgeroll-gold-600 to-dodgeroll-gold-500 text-white">
      <div class="container mx-auto px-8 text-center">
        <h2 class="text-4xl lg:text-5xl font-bold mb-6">
          Ready to Win with AI?
        </h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of successful bettors who trust Edge AI Sports Models for their winning predictions.
        </p>
        <UButton 
          to="/login" 
          size="xl" 
          color="white" 
          class="bg-white text-dodgeroll-gold-600 hover:bg-gray-100 font-bold px-8 py-4"
        >
          Start Your Winning Streak
        </UButton>
      </div>
    </section>
  </div>

  <!-- Authenticated User Dashboard -->
  <div v-else class="mx-auto container py-10">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-dire-wolf mb-2">Today's AI Predictions</h1>
      <p class="text-gray-600">Data-driven insights for today's games</p>
    </div>
    <UTable @select="doSomething" :data="mlbData" :columns="columns"></UTable>
  </div>
</template>