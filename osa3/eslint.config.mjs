export default {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: [
    'stylistic',
  ],
  extends: ['eslint:recommended'],
  rules: {
    'stylistic/js/indent': 'error',
    'stylistic/js/linebreak-style': 'error',
    'stylistic/js/quotes': 'error',
    'stylistic/js/semi': 'error',
    'eqeqeq': 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': 'error',
    'arrow-spacing': 'error',
    'no-console': 'off',
  },
};