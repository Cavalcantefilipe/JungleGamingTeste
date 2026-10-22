import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const MAX_FILE_LINES = 300;
const MAX_FUNCTION_LINES = 40;
const MAX_NESTING_DEPTH = 3;

const mockImportsAllowedIn = [
  'src/app/main.tsx',
  'src/mocks/**',
  'src/**/*.test.{ts,tsx}',
  'e2e/**',
];

export default defineConfig([
  globalIgnores([
    'dist',
    'node_modules',
    'reports',
    'public',
    '.superpowers',
    'src/routeTree.gen.ts',
    'e2e/__screenshots__',
  ]),
  {
    files: ['**/*.{ts,tsx,mjs}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      importX.flatConfigs.recommended,
      importX.flatConfigs.typescript,
      jsxA11y.flatConfigs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: { ...globals.browser, ...globals.node },
      parserOptions: {
        projectService: { allowDefaultProject: ['*.mjs', 'eslint.config.js'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({ project: ['tsconfig.app.json', 'tsconfig.node.json'] }),
      ],
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'max-lines': ['error', { max: MAX_FILE_LINES, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'warn',
        { max: MAX_FUNCTION_LINES, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      'max-depth': ['error', MAX_NESTING_DEPTH],
      'no-warning-comments': ['error', { terms: ['todo', 'fixme'], location: 'anywhere' }],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index'], 'type'],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import-x/no-default-export': 'error',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/lib/http.ts', ...mockImportsAllowedIn],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['axios'], message: 'Use o cliente de src/lib/http.ts.' },
            {
              group: ['@/mocks/*', '**/mocks/*'],
              message: 'Mocks só entram em main.tsx e testes.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/routes/**/*.tsx', 'vite.config.ts', 'playwright.config.ts', 'eslint.config.js'],
    rules: { 'import-x/no-default-export': 'off' },
  },
  {
    files: ['src/components/ui/**/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off', 'max-lines-per-function': 'off' },
  },
  {
    files: ['src/**/*.test.{ts,tsx}', 'e2e/**/*.ts'],
    rules: { 'max-lines-per-function': 'off', 'max-lines': 'off' },
  },
]);
