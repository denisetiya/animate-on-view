module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      '@typescript-eslint/recommended',
    ],
    plugins: [
      '@typescript-eslint',
    ],
    ignorePatterns: ['*.cjs'],
    overrides: [
      {
        files: ['*.svelte'],
        parser: 'svelte-eslint-parser',
        parserOptions: {
          parser: '@typescript-eslint/parser',
        },
      },
    ],
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 2020,
    },
    env: {
      browser: true,
      es2017: true,
      node: true,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  };