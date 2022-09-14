module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    // commonjs: true,
  },
  extends: [
    '@antfu',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'curly': ['error', 'all'],
    'brace-style': 'off',
    '@typescript-eslint/brace-style': ['error', 'stroustrup'],
    'vue/component-tags-order': ['error', {
      order: ['template', 'script', 'style'],
    }],
    'vue/max-attributes-per-line': ['error', {
      singleline: {
        max: 3,
      },
      multiline: {
        max: 1,
      },
    }],
  },
}
