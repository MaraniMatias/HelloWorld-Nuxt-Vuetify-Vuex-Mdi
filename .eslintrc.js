// eslint-disable-next-line
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    // 'plugin:compat/recommended',
  ],
  globals: {
    grecaptcha: 'readonly',
    Mercadopago: 'readonly',
  },
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    // 'compat/compat': 'warn',
    'vue/no-v-html': 'off',
  },
}
