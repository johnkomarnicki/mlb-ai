<script setup lang="ts">
// Redirect if not admin
const user = useSupabaseUser();

if (!user.value || user.value.email !== "johnkomarnickicontact@gmail.com") {
  throw createError({
    statusCode: 403,
    statusMessage: "Access Denied",
  });
}

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

const loadingMLBMatchups = ref(false);
async function runMlbMatchups() {
  loadingMLBMatchups.value = true;
  try {
    await $fetch("/api/getMLBDailyMatchUps", {
      method: "GET",
    });
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
    loadingMLBMatchups.value = false;
  }
}

const loadingMLBOutcomes = ref(false);
async function runMlbOutcome() {
  loadingMLBOutcomes.value = true;
  try {
    await $fetch("/api/evaluatePredictions", {
      method: "GET",
    });
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
    loadingMLBOutcomes.value = false;
  }
}

const loadingMLBRecentPerformance = ref(false);
async function runMlbRecentPerformance() {
  loadingMLBRecentPerformance.value = true;
  try {
    await $fetch("/api/getMLBRecentPerformance", {
      method: "GET",
    });
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
    loadingMLBRecentPerformance.value = false;
  }
}
</script>

<template>
  <div class="py-12 md:py-24">
    <div class="flex flex-col gap-10 container mx-auto">
      <div>
        <h1 class="text-3xl mb-4">Run Entire MLB Model Workflow</h1>
        <UButton
          @click="runMlbModel"
          :loading="loadingMLBModel"
          label="Run MLB Model"
        />
      </div>
      <div>
        <h1 class="text-3xl mb-4">MLB Model Recent Performance</h1>
        <UButton
          @click="runMlbRecentPerformance"
          :loading="loadingMLBRecentPerformance"
          label="Run MLB Matchups"
        />
      </div>
      <div>
        <h1 class="text-3xl mb-4">MLB Model Matchups</h1>
        <UButton
          @click="runMlbMatchups"
          :loading="loadingMLBMatchups"
          label="Run MLB Matchups"
        />
      </div>
      <div>
        <h1 class="text-3xl mb-4">MLB Model Outcomes</h1>
        <UButton
          @click="runMlbOutcome"
          :loading="loadingMLBOutcomes"
          label="Run MLB Outcomes"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
