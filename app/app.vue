<script setup lang="ts">
onMounted(() => {
  localStorage.removeItem("nuxt-color-mode");
});
</script>
<template>
  <div>
    <UApp>
      <NuxtLayout class="font-montserrat">
        <BaseNavigation />
        <NuxtPage />
      </NuxtLayout>
    </UApp>
  </div>
</template>
