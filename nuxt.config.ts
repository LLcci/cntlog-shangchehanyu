// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@nuxt/content",
    "@vueuse/nuxt",
  ],
  css: ["~/assets/main.css", "gitalk/dist/gitalk.css"],
  app: {
    head: {
      title: "上车函予技术博客 - 全栈架构师 | 前端动画与3D技术",
      meta: [
        {
          name: "description",
          content:
            "上车函予的个人技术博客，分享全栈开发、前端动画、3D技术、云原生架构等现代Web开发实践经验与创新思考。",
        },
        {
          name: "keywords",
          content:
            "全栈开发,前端动画,3D技术,云原生架构,Node.js,Vue3,NestJS,Web开发,技术博客,上车函予",
        },
      ],
      link: [{ rel: "icon", type: "image/x-icon", href: "favicon.ico" }],
    },
    baseURL: "/cntlog-shangchehanyu/",
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
