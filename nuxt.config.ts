// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  ssr: true,
  typescript: {
    strict: false,
  },
  app: {
    // baseURL: '/profile/'
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/scripts",
    "@nuxt/test-utils",
    "@nuxt/ui",
  ],
});
