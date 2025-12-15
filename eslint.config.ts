import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import * as mdxPlugin from 'eslint-plugin-mdx';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint, { configs } from 'typescript-eslint';

import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint';

const ignoresConfig = [
  {
    name: 'custom/eslint/ignores',
    ignores: ['.docusaurus', '.vscode'],
  },
] as FlatConfig.ConfigArray;

const eslintConfig = [
  {
    name: 'custom/eslint/recommended',
    files: ['**/*.(m|c)js', '**/*.js?(x)'],
    ...eslint.configs.recommended,
  },
];

const tseslintConfig = tseslint.config(
  {
    name: 'custom/ts-eslint/recommended',
    files: ['**/*.ts?(x)'],
    extends: [
      ...configs.recommendedTypeChecked,
      ...configs.stylisticTypeChecked,
    ] as FlatConfig.ConfigArray,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    name: 'custom/ts-eslint/import',
    files: ['**/*.ts?(x)'],
    extends: [
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
    ] as FlatConfig.ConfigArray,
    rules: {
      // @theme, @site 등의 Docusaurus 특수 import에 대해서는 resolver 규칙 완화
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^@theme', '^@docusaurus'],
        },
      ],
      'import/order': [
        'error',
        {
          named: { enabled: true, types: 'types-first' },
          alphabetize: {
            order: 'asc',
            orderImportKind: 'asc',
            caseInsensitive: true,
          },
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
          pathGroups: [
            { pattern: 'react', group: 'external', position: 'before' },
            { pattern: 'react-dom', group: 'external', position: 'before' },
            { pattern: '@/**', group: 'internal' },
          ],
          'newlines-between': 'always',
        },
      ],
    },
    settings: {
      'import/resolver': {
        typescript: true,
      },
    },
  },
  {
    ...configs.disableTypeChecked,
    name: 'custom/ts-eslint/disable-type-checked',
    files: ['**/*.(c|m)js', '**/*.mdx/**'],
  },
);

const docusaurusConfig = [
  {
    name: 'custom/docusaurus/config',
    files: ['**/*.js?(x)', '**/*.ts?(x)'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs.flat['jsx-runtime'].rules,
      ...reactHooksPlugin.configs.recommended.rules,
    },
  },
] as FlatConfig.ConfigArray;

const mdxConfig = [
  {
    name: 'custom/mdx/recommended',
    ...mdxPlugin.flat,
    files: ['**/*.mdx'],
    processor: mdxPlugin.createRemarkProcessor({
      lintCodeBlocks: true,
      languageMapper: {},
    }),
  },
  {
    name: 'custom/mdx/code-blocks',
    files: ['**/*.mdx'],
    ...mdxPlugin.flatCodeBlocks,
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          implicitStrict: true,
          ecmaVersion: 'latest',
          jsx: true,
        },
      },
    },
    rules: {
      ...mdxPlugin.flatCodeBlocks.rules,
      'no-var': 'error',
      'prefer-const': 'error',
      'react/prop-types': 'off',
      'react/jsx-no-undef': 'off',
      'react-hooks/rules-of-hooks': 'off',
    },
  },
] as FlatConfig.ConfigArray;

export const prettierConfig = [
  {
    ...eslintPluginPrettierRecommended,
    name: 'custom/prettier-plugin/recommended',
  },
  { ...eslintConfigPrettier, name: 'custom/prettier-config' },
];

export default [
  ...ignoresConfig,
  ...eslintConfig,
  ...tseslintConfig,
  ...docusaurusConfig,
  ...mdxConfig,
  ...prettierConfig,
] satisfies FlatConfig.Config[];
