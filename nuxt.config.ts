export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  extends: [
    './nuxt-base',
    './nuxt-base-ui',
  ],
  nitro: {
    routeRules: {
      '/**': {
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'X-Frame-Options': 'ALLOWALL',
          'Content-Security-Policy': "frame-ancestors 'self' https://app.storyblok.com",
        },
      },
    },
    imports: {
      dirs: ['./types', './utils', './server/utils'],
    },
  },
  imports: {
    dirs: ['./types', './utils'],
  },
  css: ['~/assets/css/base.css'],
  modules: ['@nuxtjs/google-fonts', '@nuxtjs/tailwindcss'],
  // @ts-ignore
  googleFonts: {
    families: {
      Roboto: [300, 400, 500, 700],
    },
  },
  vite: {
    server: {
      allowedHosts: ['swarm-revert-wiring.ngrok-free.dev'],
    },
    optimizeDeps: {
      include: ['lucide-vue-next'],
      force: true,
    },
  },
  hooks: {
    'app:resolve'(app) {
      app.middleware = app.middleware.filter(
        (m, i, arr) => arr.findIndex((m2) => m2.name === m.name) === i
      )
    },
  },
})