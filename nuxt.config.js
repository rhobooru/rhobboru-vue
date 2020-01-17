const isDev = process.env.NODE_ENV !== 'production'

export default {
  mode: 'spa',
  router: {
    extendRoutes (routes, resolve) {
      // routes.push({
      //   name: 'recordsFull',
      //   path: '/records/:page?',
      //   component: resolve(__dirname, 'pages/records/index.vue')
      // })
    },
    middleware: 'resetDrawer'
  },
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    '@fortawesome/fontawesome-free/css/all.css',
    '~/assets/global.css',
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/TiptapVuetify',
    '~/plugins/Vue2Storage',
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    //'@nuxtjs/eslint-module',
    '@nuxtjs/vuetify'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Needs to go before axios: https://github.com/potato4d/nuxt-client-init-module/issues/62
    'nuxt-client-init-module',

    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    //'@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/apollo',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    headers:{
      common: {
        'Access-Control-Allow-Origin': '*',
      },
    },
    crossDomain: true,
  },
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    defaultAssets: false,
    icons: {
      iconfont: 'fa',
    },
    // customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          primary: '#176FC6',
          accent: '#AB4393',
          secondary: '#30B1DC',
          success: '#4CAF50',
          info: '#97BAD6',
          warning: '#FB8C00',
          error: '#EA5858'
        },
        dark: {
          primary: '#0F8CD2',
          accent: '#C32890',
          secondary: '#13AE82',
          success: '#0CB41C',
          info: '#A4BFD4',
          warning: '#E59518',
          error: '#D42828'
        },
      }
    }
  },
  apollo: {
    authenticationType: 'Bearer',
    clientConfigs: {
        default: '~/client-config.ts'
    },
  },
  pwa: {
    manifest: {
      lang: 'en',
      name: "PWATestApp",
      short_name: "PWA/Nuxt - Test App",
      display: 'standalone',
      theme_color: '#F11010',
    },
    workbox: {
      dev: isDev
    }
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
    transpile: ['vuetify/lib', "tiptap-vuetify"],
  }
}
