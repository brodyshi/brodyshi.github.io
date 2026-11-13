import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import astro from 'eslint-plugin-astro';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  {
    ignores: ['.astro/**', 'dist/**'],
  },
  {
    files: ['**/*.{js,mjs,ts}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
  },
  {
    files: ['**/*.{js,mjs}', 'astro.config.ts'],
    ignores: ['src/**'],
    languageOptions: { globals: globals.node },
  },
  astro.configs.recommended,
  {
    files: ['**/*.{astro,js,mjs,ts}'],
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          // Keep side-effect imports after other imports and in their original order.
          groups: [['^node:'], ['^@?\\w'], ['^'], ['^\\.'], ['^\\u0000']],
        },
      ],
    },
  },
  {
    files: ['**/*.md'],
    extends: [markdown.configs.recommended],
    language: 'markdown/gfm',
    languageOptions: { frontmatter: 'yaml', math: true },
  },
  {
    files: ['**/*.json'],
    plugins: { json },
    extends: ['json/recommended'],
    language: 'json/json',
  },
  {
    files: ['**/*.jsonc', '**/tsconfig*.json', '.vscode/**/*.json'],
    plugins: { json },
    extends: ['json/recommended'],
    language: 'json/jsonc',
    languageOptions: { allowTrailingCommas: true },
  },
  prettier,
);
