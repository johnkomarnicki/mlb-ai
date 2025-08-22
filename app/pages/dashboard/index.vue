<script setup lang="ts">
// SEO Meta Data
useSeoMeta({
  title: "Dashboard - Edge AI Bets",
  description:
    "Your personalized dashboard for AI-powered MLB predictions and analytics",
  robots: "noindex, nofollow",
});

const user = useSupabaseUser();
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto pb-8 pt-20 md:pt-20">
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
        <nav class="flex space-x-8">
          <NuxtLink
            to="/dashboard/mlb"
            class="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            active-class="border-blue-500 text-blue-600"
          >
            <Icon name="ion-baseball-outline" class="w-4 h-4" />
            <span class="font-medium text-sm">MLB</span>
          </NuxtLink>
          <NuxtLink
            to="/dashboard/cfb"
            class="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            active-class="border-blue-500 text-blue-600"
          >
            <Icon name="fluent-mdl2-college-football" class="w-4 h-4" />
            <span class="font-medium text-sm">CFB</span>
          </NuxtLink>
          <NuxtLink
            to="/dashboard/nfl"
            class="flex items-center space-x-2 py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            active-class="border-blue-500 text-blue-600"
          >
            <Icon name="ion-american-football" class="w-4 h-4" />
            <span class="font-medium text-sm">NFL</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Main Content -->
      <NuxtPage />
    </div>
  </div>
</template>
