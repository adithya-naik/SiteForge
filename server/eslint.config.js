import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      // Include both browser and node globals
      globals: { ...globals.node, ...globals.browser },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      // optional custom rules
      'no-unused-vars': ['error', { args: 'after-used', ignoreRestSiblings: true }],
      'semi': ['error', 'always'],
      'quotes': ['error', 'single']
    },
  },
]);