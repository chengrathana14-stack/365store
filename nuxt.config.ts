// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  experimental: {
    appManifest: false,
  },
  app: {
    head: {
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
        },
      ],
    },
  },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    },
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ["node"],
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      cssMinify: true,
      minify: "esbuild",
    },
  },
});
