export default defineCronHandler('daily-mlb-model', {
  // Run every day at 10:00 AM EST (15:00 UTC)
  // Note: Adjust timezone as needed for EST/EDT
  cronTime: '0 10 * * *',
  timezone: 'America/New_York',
  runOnInit: false,
  onTick: async () => {
    try {
      console.log('🕙 Cron job started: Running daily MLB model at 10:00 AM EST');
      
      // Call our MLB model API endpoint
      await $fetch('/api/runMLBmodel', {
        method: 'GET',
        baseURL: useRuntimeConfig().public.apiBase
      });
      
      console.log('✅ Cron job completed: MLB model executed successfully');
    } catch (error) {
      console.error('❌ Cron job failed: MLB model execution error:', error);
    }
  }
});