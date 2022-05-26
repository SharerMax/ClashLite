module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    commonjs: true,
  },
  extends: [
    'eslint-config-airbnb-base',
    'plugin:vue/essential',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    semi: ['error', 'never'],
    'max-len': ['warn', { code: 100 }],
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'prefer-template': 'error',
    'import/no-extraneous-dependencies': 'off',
  },
}
