<script setup lang="ts">
const toast = useToast();
const loadingMLBModel = ref(false);
async function runMlbModel() {
  loadingMLBModel.value = true;
  try {
    await $fetch("/api/getMLBDailyMatchUps", {
      method: "GET",
    });
    await $fetch("/api/getMLBStats", {
      method: "GET",
    });
    await $fetch("/api/getMLBRecentPerformance", {
      method: "GET",
    });
    const res = await $fetch(
      "https://johnkomarnicki.app.n8n.cloud/webhook/f01b7703-b14c-4e3e-b75d-e12f8ba81e13",
      {
        method: "GET",
      }
    );
    console.log(res);
    toast.add({
      title: "Success!",
      color: "primary",
    });
  } catch {
    toast.add({
      title: "Error: Model unsuccessful",
      color: "error",
    });
  } finally {
    loadingMLBModel.value = false;
  }
}
</script>

<template>
  <div class="py-12 md:py-24">
    <div class="container mx-auto">
      <h1 class="text-3xl mb-4">MLB Model</h1>
      <UButton
        @click="runMlbModel"
        :loading="loadingMLBModel"
        label="Run MLB Model"
      />
    </div>
  </div>
</template>

<style scoped></style>
