<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";

const { gameId } = useRoute().params;
const gameDataObj = ref<MLBData | undefined>();

type PitcherStats = {
  era: string;
  whip: string;
  wins: number;
  losses: number;
  inningsPitched: string;
};

type GameInfo = {
  ampm: string;
  time: string;
  dayNight: string;
  orginalDate: string;
  officialDate: string;
};

type MLBData = {
  game_id: string;
  homeTeam: {
    id: string;
    name: string;
  };
  awayTeam: {
    id: string;
    name: string;
  };
  probablePitchers: {
    away: {
      id: number;
      link: string;
      fullName: string;
    };
    home: {
      id: number;
      link: string;
      fullName: string;
    };
  };
  homePitcherStats: PitcherStats;
  awayPitcherStats: PitcherStats;
  gameInfo: GameInfo;
};

const client = useSupabaseClient();

// const { data: gameData, error: gameError } = await useAsyncData<MLBData[]>(
//   async () => {
//     const { data, error } = await client
//       .from("mlb_matchup_stats")
//       .select("*")
//       .eq("game_id", gameId!);
//     if (error) throw error;
//     return data;
//   }
// );

const { data: gameInfo, error: gameInfoError } = await useAsyncData<any>(
  async () => {
    const res = $fetch(
      `https://statsapi.mlb.com/api/v1.1/game/${gameId}/feed/live`
    );

    return res;
  }
);

// gameDataObj.value = gameData.value ? gameData.value[0] : undefined;

// const pitcherColumns: TableColumn<MLBData>[] = [
//   {
//     accessorKey: "Average",
//     header: () => {
//       return h("p", { class: "flex-1" }, "Stats");
//     },
//     cell: ({ row }) => {
//       return h(
//         "div",
//         { class: " text-lg font-bold flex flex-1 flex-col gap-4" },
//         [
//           h("p", {}, row.original.homePitcherStats.wins),
//           h("p", {}, row.original.homePitcherStats.losses),
//           h("p", {}, row.original.homePitcherStats.inningsPitched),
//           h("p", {}, row.original.homePitcherStats.era),
//           h("p", {}, row.original.homePitcherStats.whip),
//         ]
//       );
//     },
//   },
//   {
//     accessorKey: "Average",
//     header: () => {
//       return h("p", { class: "flex-1 text-center" }, "Category");
//     },
//     cell: ({ row }) => {
//       return h(
//         "div",
//         { class: "flex text-lg font-bold flex-col flex-1 items-center gap-4" },
//         [
//           h("p", {}, "Wins"),
//           h("p", {}, "Losses"),
//           h("p", {}, "Innings Pitched"),
//           h("p", {}, "ERA"),
//           h("p", {}, "WHIP"),
//         ]
//       );
//     },
//   },
//   {
//     accessorKey: "Average",
//     header: () => {
//       return h("p", { class: "flex-1 text-right" }, "Stats");
//     },
//     cell: ({ row }) => {
//       return h(
//         "div",
//         { class: "flex flex-1 flex-col gap-4 text-right text-lg font-bold" },
//         [
//           h("p", {}, row.original.awayPitcherStats.wins),
//           h("p", {}, row.original.awayPitcherStats.losses),
//           h("p", {}, row.original.awayPitcherStats.inningsPitched),
//           h("p", {}, row.original.awayPitcherStats.era),
//           h("p", {}, row.original.awayPitcherStats.whip),
//         ]
//       );
//     },
//   },
// ];
</script>

<template>
  <div class="py-10 container mx-auto">
    <div class="mx-auto flex flex-col gap-10 max-w-[1000px]">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <UAvatar
            size="3xl"
            :src="`https://www.mlbstatic.com/team-logos/${gameInfo?.gameData.teams.home.id}.svg`"
            :alt="gameInfo?.gameData.teams.home.name!"
            :ui="{
              root: 'bg-white/75 p-1.5',
              image: 'object-contain rounded-none',
            }"
          ></UAvatar>
          <p>{{ gameInfo?.gameData.teams.home.name }}</p>
        </div>
        <span>vs</span>
        <div class="flex items-center gap-2">
          <UAvatar
            size="3xl"
            :src="`https://www.mlbstatic.com/team-logos/${gameInfo?.gameData.teams.away.id}.svg`"
            :alt="gameInfo?.gameData.teams.away.id!"
            :ui="{
              root: 'bg-white/75 p-1.5',
              image: 'object-contain rounded-none',
            }"
          ></UAvatar>
          <p>{{ gameInfo?.gameData.teams.home.name }}</p>
        </div>
      </div>
      <div class="flex flex-col gap-3">
        <h2 class="text-xl">Pitcher Matchup</h2>
        <div class="flex gap-4 text-lg">
          <p class="font-bold flex-1">
            {{ gameDataObj?.probablePitchers["home"].fullName }}
          </p>
          <p class="flex-1 font-bold text-right">
            {{ gameDataObj?.probablePitchers["away"].fullName }}
          </p>
        </div>
        <!-- <UTable
          :data="gameData"
          :columns="pitcherColumns"
          class="flex-1"
        ></UTable> -->
      </div>
    </div>
  </div>
</template>
