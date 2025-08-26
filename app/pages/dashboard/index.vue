<script setup lang="ts">
// SEO Meta Data
useSeoMeta({
  title: "Dashboard - Edge AI Bets",
  description:
    "Your personalized dashboard for AI-powered MLB predictions and analytics",
  robots: "noindex, nofollow",
});

const user = useSupabaseUser();

const navigationItems = [
  {
    label: "MLB",
    icon: "ion-baseball-outline",
    to: "/dashboard/mlb",
  },
  {
    label: "NFL",
    icon: "ion-american-football",
    to: "/dashboard/nfl",
  },
  {
    label: "CFB",
    icon: "fluent-mdl2-college-football",
    to: "/dashboard/cfb",
  },
];
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto pb-8 pt-20 md:pt-20 px-4">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-semibold text-gray-900">
            Welcome back, {{ user?.email?.split("@")[0] || "User" }}
          </h1>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="border-b border-gray-200 mb-8">
        <UNavigationMenu
          color="neutral"
          variant="link"
          :items="navigationItems"
          class="w-full"
          :ui="{
            list: 'gap-2',
          }"
        />
      </div>

      <!-- Main Content -->
      <NuxtPage />
    </div>
  </div>
</template>
