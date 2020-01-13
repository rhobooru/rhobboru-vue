import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  router: {
    extendRoutes (routes, resolve) {
      // routes.push({
      //   name: 'recordsFull',
      //   path: '/records/:page?',
      //   component: resolve(__dirname, 'pages/records/index.vue')
      // })
    }
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
    '@nuxtjs/pwa',
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
    icons: {
      iconfont: 'fa',
    },
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  apollo: {
    authenticationType: 'Bearer',
    clientConfigs: {
      default: {
        httpEndpoint: 'http://127.0.0.1:8000/graphql',
        httpLinkOptions: {
          mode: 'cors'
        },
      }
    },
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
