/* eslint no-console: 0 */
import es from 'vuetify/es5/locale/es'
import * as Colors from './scripts/Colors'

require('dotenv-flow').config({ purge_dotenv: true, silent: true })
console.log(
  `${Colors.FgYellow}➤${Colors.Reset} Client: ` +
    `${Colors.FgGreen}${Colors.Bright}${process.env.NUXT_ENV_TITLE} `
)
process.env.NUXT_ENV_VERSION = require('./package.json').version

export default {
  target: 'static',
  mode: 'spa',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '',
    title: 'Encuestas',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Tribal © ' + new Date().getFullYear() },
      {
        hid: 'description',
        name: 'description',
        content: 'Aapresid encuestas',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: process.env.NUXT_ENV_VUETIFY_THEME_PRIMARY },
  /*
   ** Global CSS
   */
  css: ['~/assets/css/main.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    { src: '~/plugins/Notifier', mode: 'client' },
    { src: '~/plugins/Axion', mode: 'client' },
    { src: '~/plugins/Router', mode: 'client' },
    { src: '~/plugins/GlobalComponents', mode: 'client' },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    // https://github.com/nuxt-community/router-extras-module
    '@nuxtjs/router-extras',
    '@nuxtjs/vuetify',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      themes: {
        light: {
          primary: process.env.NUXT_ENV_VUETIFY_THEME_PRIMARY,
          'primary-admin': process.env.NUXT_ENV_VUETIFY_THEME_PRIMARY_ADMIN,
          accent: process.env.NUXT_ENV_VUETIFY_THEME_PRIMARY,
          error: '#B71C1C',
        },
      },
    },
    lang: {
      locales: { es },
      current: 'es',
    },
    // https://materialdesignicons.com/
    // https://cdn.materialdesignicons.com/5.3.45/
    icons: {
      iconfont: 'mdi',
    },
  },
  /*
   ** Build configuration
   */
  build: {
    // analyze: process.env.NODE_ENV === 'production',
    filenames: {
      app: ({ isDev }) => (isDev ? '[name].js' : '[contenthash].js'),
      chunk: ({ isDev }) => (isDev ? '[name].js' : '[id].[contenthash].js'),
    },
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx && ctx.isClient) {
        config.optimization.splitChunks.maxSize = 1324000
      }
    },
  },
  render: {
    bundleRenderer: {
      shouldPreload: (_, type) => {
        return ['script', 'style', 'font'].includes(type)
      },
    },
  },
}
