<script setup>
const user = useSupabaseUser();

// Redirect to user's bracket or login
onMounted(() => {
  if (user.value) {
    navigateTo(`/mlb/postseason/${user.value.id}`);
  } else {
    navigateTo('/login');
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-gray-500" />
  </div>
</template>