<script setup lang="ts">
const user = useSupabaseUser();
</script>

<template>
  <div class="hero py-12 md:py-24">
    <div class="container mx-auto px-8">
      <div class="mx-auto flex flex-col items-center justify-center">
        <h1
          class="text-abbey-900 max-w-5xl text-balance text-center text-4xl sm:text-5xl md:text-6xl md:leading-[70px] mb-4 font-bold"
        >
          Smarter bets, not harder ones.
        </h1>
        <p
          class="text-abbey-900 max-w-5xl text-balance text-sm sm:text-base md:text-lg text-center mb-6"
        >
          AI-powered sports picks that give you an edge — backed by data, built
          for bettors who want to win more, not guess more.
        </p>
        <div v-if="!user" class="flex gap-2">
          <UButton to="/login" color="info" size="xl" label="Signup For Free" />
          <UButton to="/login" color="primary" size="xl" label="Login" />
        </div>
        <UButton
          v-else
          color="primary"
          to="/mlb"
          label="Go to models"
          size="xl"
        />
        <NuxtImg src="/hero-img-light-2.png" class="mt-10 max-w-5xl w-full" />
        <p class="mt-10 text-sm text-center max-w-4xl text-balance italic">
          * All picks and predictions shared on this site are for informational
          and entertainment purposes only. They are not guaranteed outcomes and
          should not be considered financial advice. Always bet responsibly and
          only wager what you can afford to lose. 21+ only.
        </p>
      </div>
    </div>
  </div>
</template>
