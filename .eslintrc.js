module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    // commonjs: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint-config-airbnb-base',
    'eslint-config-airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    project: './tsconfig.eslint.json',
    extraFileExtensions: ['.vue', '*.cjs', '*.mjs'],
  },
  overrides: [
    {
      files: '*.vue',
      parser: 'vue-eslint-parser',
    },
  ],
  plugins: [
    'vue',
    '@typescript-eslint',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // semi: ['error', 'never'],
    semi: 'off',
    '@typescript-eslint/semi': ['error', 'never'],
    'max-len': ['warn', { code: 100 }],
    'no-restricted-syntax': 'off',
    'no-plusplus': 'off',
    'no-continue': 'off',
    'prefer-template': 'error',
    'import/no-extraneous-dependencies': 'off',

    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
  },
}
