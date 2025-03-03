const js = require('@eslint/js');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');
const typescriptEslintParser = require('@typescript-eslint/parser');
const pluginImport = require('eslint-plugin-import');
const pluginPrettier = require('eslint-plugin-prettier');

module.exports = [
  { ignores: ['**/node_modules/**', 'dist/**'] },
  js.configs.recommended,
  {
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      import: pluginImport,
      prettier: pluginPrettier,
    },
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        test: 'readonly',
        jest: 'readonly',
        beforeAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        afterAll: 'readonly',
        process: 'readonly',
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'error',
      '@typescript-eslint/no-unused-vars': ['warn'],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
      ...pluginPrettier.configs.recommended.rules,
      semi: ['warn', 'always'], // Enforce semicolons at the end of statements
      'max-len': ['warn', { code: 120 }], //  Set maximum line length
      'prettier/prettier': [
        'warn',
        {
          trailingComma: 'all',
          singleQuote: true,
          tabWidth: 2,
          semi: true,
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'], // Apply TypeScript-specific rules to these files
    rules: {
      ...typescriptEslintPlugin.configs['recommended'].rules, // Add the recommended TS rules
    },
  },
];
