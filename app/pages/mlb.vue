<script setup lang="ts">
import type { TableColumn, TableRow } from "@nuxt/ui";
import moment from "moment";

const UAvatar = resolveComponent("UAvatar");
const UButton = resolveComponent("UButton");

type MLBData = {
  id: string; // uuid
  gameId: number;
  gameDate: string; // ISO date string (e.g., "2025-06-10")
  gameTime: string;
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
  vegasOdds: number | null;
};

const client = useSupabaseClient();
const today = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
// const today = "6-08-2025";
const { data: mlbData, error: mlbError } = await useAsyncData<MLBData[]>(
  async () => {
    const { data, error } = await client
      .from("gamePredictions")
      .select("*")
      .eq("gameDate", today as string)
      .order("grade", {
        ascending: true,
      });
    if (error) throw error;
    return data;
  }
);

const columns: TableColumn<MLBData>[] = [
  {
    accessorKey: "gameTime",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return h(UButton, {
        color: "primary",
        variant: "ghost",
        label: "Game Time",
        icon: isSorted
          ? isSorted === "asc"
            ? "i-lucide-arrow-up-narrow-wide"
            : "i-lucide-arrow-down-wide-narrow"
          : "i-lucide-arrow-up-down",
        class: "-mx-2.5",
        onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
      });
    },
    cell: ({ row }) => {
      return h("div", { class: "flex flex-1 items-center gap-3" }, [
        h("div", { class: "flex items-center gap-3" }, [
          h(
            "p",
            { class: "font-bold text-highlighted" },
            moment(row.original.gameTime!).format("LT")
          ),
        ]),
      ]);
    },
  },
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
          h("p", { class: " text-highlighted" }, row.original.awayTeamName!),
          h("span", { class: " text-highlighted" }, "at"),
          h(UAvatar, {
            src: `https://www.mlbstatic.com/team-logos/${row.original.homeTeamId}.svg`,
            ui: {
              root: "bg-white/75 p-1.5",
              image: "object-contain rounded-none",
            },
            alt: row.original.homeTeamName,
            size: "lg",
          }),
          h("p", { class: " text-highlighted" }, row.original.homeTeamName!),
        ]),
      ]);
    },
  },
  {
    accessorKey: "predicted_total",
    header: "Score",
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
            { class: "font-bold text-highlighted" },
            row.original.predictedAwayScore!
          ),
          h("span", "-"),
          h(
            "p",
            { class: "font-bold text-highlighted" },
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
    header: "Total",
    cell: ({ row }) => {
      return h("div", { class: "flex flex-1 items-center gap-3" }, [
        h("div", { class: "flex items-center gap-3" }, [
          h(
            "p",
            { class: "font-bold text-highlighted" },
            row.original.predictedHomeScore! + row.original.predictedAwayScore!
          ),
        ]),
      ]);
    },
  },
  {
    accessorKey: "edge_note",
    header: "Winner",
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
            { class: "font-bold text-highlighted" },
            row.original.teamEdgeName!
          ),
        ]),
      ]);
    },
  },
  {
    accessorKey: "edge_note",
    header: "Odds",
    cell: ({ row }) => {
      return h("div", { class: "flex flex-1 items-center gap-3" }, [
        h("div", { class: "flex items-center gap-3" }, [
          h(
            "p",
            { class: "font-bold text-highlighted" },
            row.original.vegasOdds!
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
          h("p", { class: "font-bold text-highlighted" }, row.original.grade!),
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

const sorting = ref([
  {
    id: "gameTime",
    desc: false,
  },
]);
</script>

<template>
  <UModal
    v-model:open="selectedRow"
    class="overflow-scroll"
    :ui="{
      content: 'p-10 max-w-2xl',
    }"
  >
    <template #content>
      <div
        class="border-none flex flex-col md:flex-row gap-2 md:items-center mb-2 text-abbey-500"
      >
        <h1 class="text-balance text-xl">
          <span class="font-bold"> {{ selectedRow?.awayTeamName }} </span>
          at
          <span class="font-bold"> {{ selectedRow?.homeTeamName }} </span>
        </h1>
        <p class="md:ml-auto">
          AI Grade: <span class="font-bold">{{ selectedRow?.grade }}</span>
        </p>
      </div>
      <h2 class="text-lg mb-2 border-none">Game Analysis</h2>
      <div
        class="prose text-abbey-500 lg:prose-sm"
        v-html="selectedRow?.summary"
      ></div>
    </template>
  </UModal>
  <div class="mx-auto container py-10">
    <UTable
      class="flex-1"
      v-model:sorting="sorting"
      @select="doSomething"
      :data="mlbData"
      :columns="columns"
    ></UTable>
  </div>
</template>

<style></style>
