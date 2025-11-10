// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@nuxt/image", "@nuxt/ui", "@nuxt/content",'@vueuse/nuxt'],
  css: ["~/assets/main.css"],
  app: {
    head: {
      title: "上车函予的个人网站",
      meta: [{ name: "description", content: "上车函予的个人网站" }],
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },
  ui: {
    fonts: false,
  },
  icon: {
    customCollections: [
      {
        prefix: "custom",
        dir: "./app/assets/icons",
      },
    ],
  },
});
