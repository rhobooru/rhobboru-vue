module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    $nuxt: true
  },
  extends: [
    '@nuxtjs',
    //'prettier',
    //'prettier/vue',
    //'plugin:prettier/recommended',
    'plugin:nuxt/recommended',
    'plugin:vue/recommended'
  ],
  plugins: [
    //'prettier',
  ],
  rules: {
    'vue/require-prop-types': 'off',
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/max-attributes-per-line': ['error', {
      "singleline": 1,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }],
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    "comma-dangle": ["error", {
      "arrays": "always-multiline",
      "objects": "only-multiline",
      "imports": "never",
      "exports": "never",
      "functions": "never"
    }],
  }
}
