<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
    <!-- Hero Section -->
    <section class="relative py-20 px-4 lg:px-8">
      <div class="flex flex-col items-center justify-center container mx-auto text-center">
        <!-- Main Heading -->
        <h1 class="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
          Smarter bets,<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> not harder ones. </span>
        </h1>

        <!-- Subheading -->
        <p class="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          AI-powered sports picks that give you an edge — backed by data, built<br />
          for bettors who want to win more, not guess more.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <UButton size="lg" color="primary" class="px-8 py-3" to="/mlb"> View MLB Predictions </UButton>
          <!-- <UButton size="lg" color="neutral" class="px-8 py-3" to="/login"> Start Free Trial </UButton> -->
        </div>

        <!-- Hero Image -->
        <NuxtImg src="/hero-img-light-2.png" class="mt-10 max-w-5xl w-full" />
      </div>
    </section>

    <!-- Trusted By Section -->
    <!-- <section class="py-16 px-4 lg:px-8">
      <div class="container mx-auto text-center">
        <p class="text-gray-400 mb-12">Trusted by <span class="text-white font-semibold">5,000+</span> smart bettors who consistently beat the books</p>

        <div class="flex flex-wrap justify-center items-center gap-12 opacity-80">
          <div class="text-center">
            <div class="text-white font-bold text-3xl">73%</div>
            <div class="text-gray-400 text-sm">Win Rate</div>
          </div>
          <div class="text-center">
            <div class="text-white font-bold text-3xl">+15.2%</div>
            <div class="text-gray-400 text-sm">ROI</div>
          </div>
          <div class="text-center">
            <div class="text-white font-bold text-3xl">10K+</div>
            <div class="text-gray-400 text-sm">Predictions</div>
          </div>
          <div class="text-center">
            <div class="text-white font-bold text-3xl">24/7</div>
            <div class="text-gray-400 text-sm">Analysis</div>
          </div>
        </div>
      </div>
    </section> -->

    <!-- Features Section -->
    <section id="features" class="py-20 px-4 lg:px-8">
      <div class="container mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6 max-w-3xl text-balance mx-auto">Advanced AI models built for your winning edge.</h2>
          <p class="text-gray-300 text-lg">
            Our cutting-edge algorithms analyze thousands of data points<br />
            to deliver the most accurate sports predictions available.
          </p>
        </div>

        <!-- Feature Cards -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <!-- Real-time Analytics Card -->
          <div class="bg-gradient-to-br from-slate-800/50 to-gray-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Real-Time Analytics</h3>
            <p class="text-gray-300 mb-6">
              Our AI processes live game data, player performance metrics, weather conditions, and hundreds of other variables in real-time to give you the most accurate
              predictions right up to game time.
            </p>
          </div>

          <!-- Detailed AI Predictions Card -->
          <div class="bg-gradient-to-br from-gray-800/50 to-slate-800/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8">
            <div class="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mb-6">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-white mb-4">Detailed AI Predictions</h3>
            <p class="text-gray-300 mb-6">
              Get comprehensive predictions with team scores, winning team selection, confidence grades, and detailed AI-generated summaries explaining the reasoning behind each
              pick.
            </p>
          </div>
        </div>

        <!-- Machine Learning Models Card -->
        <div class="bg-gradient-to-br from-slate-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-600/30 rounded-2xl p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div class="w-12 h-12 bg-slate-600 rounded-lg flex items-center justify-center mb-6">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-4">Advanced ML Models</h3>
              <p class="text-gray-300 mb-6">
                Our sophisticated machine learning models combine comprehensive historical data, recent team performance trends, and multiple other factors to generate highly
                accurate predictions for every game outcome.
              </p>
            </div>

            <!-- Code/Algorithm Visualization -->
            <div class="bg-gray-900 rounded-lg p-4 font-mono text-sm border border-gray-700">
              <div class="flex items-center space-x-2 mb-4">
                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                <span class="text-gray-400 ml-4">prediction_model.py</span>
              </div>
              <div class="space-y-1 text-gray-300">
                <div><span class="text-blue-400">def</span> <span class="text-cyan-400">predict_game_outcome</span>(team_data):</div>
                <div class="ml-4"><span class="text-green-400">historical</span> = load_historical_data()</div>
                <div class="ml-4"><span class="text-green-400">recent</span> = get_recent_performance()</div>
                <div class="ml-4"><span class="text-green-400">factors</span> = analyze_other_factors()</div>
                <div class="ml-4"><span class="text-yellow-400">prediction</span> = model.predict(historical, recent, factors)</div>
                <div class="ml-4"><span class="text-blue-400">return</span> generate_outcome(prediction)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 lg:px-8">
      <div class="container mx-auto text-center">
        <h2 class="text-4xl lg:text-5xl font-bold text-white mb-6">
          Start winning more<br />
          with data-driven insights.
        </h2>
        <p class="text-gray-300 text-lg mb-8 max-w-3xl mx-auto">
          Join thousands of successful bettors who use our AI-powered predictions to consistently beat the sportsbooks. Get started with your free trial today and see the
          difference data makes.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <!-- <UButton size="lg" color="primary" class="px-8 py-3" to="/login"> Start Free Trial </UButton> -->
          <UButton size="lg" color="primary" class="px-8 py-3" to="/mlb"> View Model Predictions </UButton>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-16 px-4 lg:px-8 border-t border-gray-700">
      <div class="container mx-auto">
        <!-- <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 class="text-white font-semibold mb-4">Contact</h3>
            <div class="space-y-2 text-gray-400">
              <p>Support: support@edgeaisports.com</p>
              <p>Partnerships: partners@edgeaisports.com</p>
              <p>General: info@edgeaisports.com</p>
            </div>
          </div>

          <div>
            <h3 class="text-white font-semibold mb-4">Product</h3>
            <div class="space-y-2 text-gray-400">
              <p><NuxtLink to="/mlb" class="hover:text-white transition-colors">MLB Predictions</NuxtLink></p>
              <p><NuxtLink to="/login" class="hover:text-white transition-colors">Get Started</NuxtLink></p>
              <p><NuxtLink to="#" class="hover:text-white transition-colors">API Access</NuxtLink></p>
            </div>
          </div>

          <div>
            <h3 class="text-white font-semibold mb-4">Resources</h3>
            <div class="space-y-2 text-gray-400">
              <p><NuxtLink to="#" class="hover:text-white transition-colors">Betting Guide</NuxtLink></p>
              <p><NuxtLink to="#" class="hover:text-white transition-colors">Strategy Tips</NuxtLink></p>
              <p><NuxtLink to="#" class="hover:text-white transition-colors">Model Accuracy</NuxtLink></p>
            </div>
          </div>

          <div>
            <h3 class="text-white font-semibold mb-4">Legal</h3>
            <div class="space-y-2 text-gray-400">
              <p><NuxtLink to="#" class="hover:text-white transition-colors">Terms of Service</NuxtLink></p>
              <p><NuxtLink to="#" class="hover:text-white transition-colors">Privacy Policy</NuxtLink></p>
              <p><NuxtLink to="#" class="hover:text-white transition-colors">Responsible Gambling</NuxtLink></p>
            </div>
          </div>
        </div> -->

        <div class="mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-2 mb-4 md:mb-0">
            <div class="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
            <span class="text-white text-xl font-bold">Edge AI Sports Model</span>
          </div>
          <div class="text-center md:text-right">
            <p class="text-gray-400 text-sm mb-2">© 2025 Edge AI Sports Model. All Rights Reserved.</p>
            <p class="text-gray-500 text-xs">21+ only. Bet responsibly. All predictions are for informational purposes only.</p>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Set page meta
useHead({
  title: "Edge AI Sports Model - Smarter bets, not harder ones.",
  meta: [{ name: "description", content: "AI-powered sports picks that give you an edge — backed by data, built for bettors who want to win more, not guess more." }],
});
</script>

<style scoped>
/* Custom styles if needed */
</style>
