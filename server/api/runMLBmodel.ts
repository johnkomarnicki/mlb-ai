export default defineEventHandler(async (event) => {
  try {
    console.log('🚀 Starting MLB model workflow...');
    
    // Step 1: Get MLB Daily Matchups
    console.log('📊 Fetching MLB daily matchups...');
    await $fetch('/api/getMLBDailyMatchUps', {
      method: 'GET',
      baseURL: useRuntimeConfig().public.apiBase
    });
    
    // Step 2: Get MLB Stats
    console.log('📈 Fetching MLB stats...');
    await $fetch('/api/getMLBStats', {
      method: 'GET',
      baseURL: useRuntimeConfig().public.apiBase
    });
    
    // Step 3: Get MLB Recent Performance
    console.log('🏆 Fetching MLB recent performance...');
    await $fetch('/api/getMLBRecentPerformance', {
      method: 'GET',
      baseURL: useRuntimeConfig().public.apiBase
    });
    
    // Step 4: Trigger external ML model via webhook
    console.log('🤖 Triggering external ML model...');
    const modelResult = await $fetch('https://johnkomarnicki.app.n8n.cloud/webhook/f01b7703-b14c-4e3e-b75d-e12f8ba81e13', {
      method: 'GET',
    });
    
    console.log('✅ MLB model workflow completed successfully');
    
    return {
      success: true,
      message: 'MLB model workflow completed successfully',
      timestamp: new Date().toISOString(),
      modelResult
    };
    
  } catch (error) {
    console.error('❌ MLB model workflow failed:', error);
    
    throw createError({
      statusCode: 500,
      statusMessage: 'MLB model workflow failed',
      data: { error: error.message }
    });
  }
});