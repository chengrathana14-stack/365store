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
      title: "365 Sports · Premium Athletic Footwear & Gear",
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes",
        },
        {
          name: "description",
          content: "Shop official sports footwear, football boots, and sportswear in Cambodia. Instant KHQR Bakong checkout, nationwide delivery, and 100% genuine gear.",
        },
        { name: "theme-color", content: "#07090e" },
      ],
    },
  },
  routeRules: {
    // Global defense-in-depth security headers protecting against XSS, clickjacking, and MIME sniffing
    "/**": {
      headers: {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "X-XSS-Protection": "1; mode=block",
        "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        "Content-Security-Policy":
          "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https://api.telegram.org https://api.qrserver.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self';",
      },
    },
    // Long-term immutable caching for built assets to save bandwidth & memory
    "/_nuxt/**": {
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  },
  nitro: {
    compressPublicAssets: true,
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
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("node_modules")) {
              if (id.includes("vue") || id.includes("vue-router")) {
                return "vendor-vue";
              }
              if (id.includes("qrcode")) {
                return "vendor-qr";
              }
            }
          },
        },
      },
    },
  },
});
