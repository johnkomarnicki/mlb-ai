<script setup lang="ts">
import type { TableColumn, TableRow } from "@nuxt/ui";

const UAvatar = resolveComponent("UAvatar");
const ULink = resolveComponent("ULink");
const UButton = resolveComponent("UButton");

type MLBData = {
  game_id: string;
  home_team: string;
  away_team: string;
  homeTeamId: number;
  awayTeamId: number;
  predicted_total: number;
  predicted_home_score: number;
  predicted_away_score: number;
  score_diff: number;
  edge_team: string;
  time: string;
  ampm: string;
};

const client = useSupabaseClient();
const today = new Date().toLocaleDateString("en-CA"); // Format: YYYY-MM-DD
// const today = "6-08-2025";
const { data: mlbData, error: mlbError } = await useAsyncData<MLBData[]>(
  async () => {
    const { data, error } = await client
      .from("gamePredictionsBeta")
      .select("*")
      .eq("gameDate", today as string);
    if (error) throw error;
    return data;
  }
);

console.log(mlbData.value);

const columns: TableColumn<MLBData>[] = [
  {
    id: "expand",
    cell: ({ row }) =>
      h(UButton, {
        color: "neutral",
        variant: "ghost",
        icon: "i-lucide-chevron-down",
        square: true,
        "aria-label": "Expand",
        ui: {
          leadingIcon: [
            "transition-transform",
            row.getIsExpanded() ? "duration-200 rotate-180" : "",
          ],
        },
        onClick: () => row.toggleExpanded(),
      }),
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
            alt: row.original.home_team,
            size: "lg",
          }),
          h("p", { class: " text-highlighted" }, row.original.awayTeamName),
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
          h("p", { class: " text-highlighted" }, row.original.homeTeamName),
        ]),
      ]);
    },
  },
  // {
  //   accessorKey: "time",
  //   header: "Game Time",
  //   cell: ({ row }) => {
  //     return h("div", { class: "flex items-center gap-3" }, [
  //       h("div", { class: "flex items-center gap-3" }, [
  //         h(
  //           "p",
  //           { class: "font-bold text-highlighted" },
  //           `${row.original.time} ${row.original.ampm}`
  //         ),
  //       ]),
  //     ]);
  //   },
  // },
  {
    accessorKey: "predicted_total",
    header: "Projected Score",
    cell: ({ row }) => {
      return h("div", { class: "flex flex-1 items-center gap-3" }, [
        h("div", { class: "flex items-center gap-3" }, [
          h(
            "p",
            { class: "font-bold text-highlighted" },
            row.original.predictedAwayScore
          ),
          h("span", "-"),
          h(
            "p",
            { class: "font-bold text-highlighted" },
            row.original.predictedHomeScore
          ),
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
            { class: "font-bold text-highlighted" },
            parseInt(row.original.predictedHomeScore) +
              parseInt(row.original.predictedAwayScore)
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
            alt: row.original.away_team,
            size: "lg",
          }),
          h(
            "p",
            { class: "font-bold text-highlighted" },
            row.original.teamEdgeName
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
          h("p", { class: "font-bold text-highlighted" }, row.original.grade),
        ]),
      ]);
    },
  },
];

const gameInsight = ref(false);
const selectedRow = ref<MLBData | boolean>(false);
function doSomething(row: TableRow<MLBData>, e?: Event) {
  selectedRow.value = row.original;
  gameInsight.value = true;
}
</script>

<template>
  <UModal
    v-model:open="gameInsight"
    :ui="{
      content: 'p-10 max-w-2xl',
    }"
  >
    <template #content>
      <div class="border-none flex items-center mb-2">
        <h1 class="text-xl">
          <span class="font-bold"> {{ selectedRow.awayTeamName }} </span>
          at
          <span class="font-bold"> {{ selectedRow.homeTeamName }} </span>
        </h1>
        <p class="ml-auto">
          AI Grade: <span class="font-bold">{{ selectedRow.grade }}</span>
        </p>
      </div>
      <h2 class="text-lg mb-2 border-none">Game Analysis</h2>
      <div
        class="prose text-white lg:prose-sm"
        v-html="selectedRow.summary"
      ></div>
    </template>
  </UModal>
  <div class="mx-auto container py-10">
    <UTable @select="doSomething" :data="mlbData" :columns="columns"></UTable>
  </div>
</template>

<style></style>
