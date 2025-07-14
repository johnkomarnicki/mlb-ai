import { defineCronHandler } from "#nuxt/cron";

export default defineCronHandler(
  () => "15 10 * * *",
  async () => {
    try {
      console.log("🕙 Cron job started: Running daily MLB model");

      // Call our MLB model API endpoint
      await $fetch("/api/runMLBModel", {
        method: "GET",
        baseURL: useRuntimeConfig().public.apiBase,
      });

      console.log("✅ Cron job completed: MLB model executed successfully");
    } catch (error) {
      console.error("❌ Cron job failed: MLB model execution error:", error);
    }
  }
);
