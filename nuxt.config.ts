// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    sharedPrerenderData: false,
    compileTemplate: true,
    resetAsyncDataToUndefined: true,
    templateUtils: true,
    relativeWatchPaths: true,
    defaults: {
      useAsyncData: {
        deep: true,
      },
    },
  },

  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/']
    }
  },

  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxtjs/supabase",
    "@nuxtjs/google-fonts",
  ],

  css: ["~/assets/css/main.css"],

  ui: {
    colors: {
      'dodgeroll-gold': {
        50: '#fff9eb',
        100: '#fdecc8',
        200: '#fbd88c',
        300: '#f9bd50',
        400: '#f79f1a',
        500: '#f1820f',
        600: '#d65f09',
        700: '#b13f0c',
        800: '#903210',
        900: '#762911',
        950: '#441204'
      },
      'apple-green': '#046e1b',
      'dire-wolf': '#292727'
    },
    typography: true
  },

  googleFonts: {
    families: {
      Montserrat: true,
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_SITE_URL || "http://localhost:3000",
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_KEY,
    },
  },
});