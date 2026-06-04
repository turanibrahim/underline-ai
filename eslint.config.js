import process from 'node:process'
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
    pnpm: true,
    stylistic: {
      indent: 2,
      quotes: 'single',
    },
  },
  {
    rules: {
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
      'ts/no-explicit-any': 'error',
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/custom-event-name-casing': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,vue}'],
    rules: {
      'antfu/top-level-function': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'FunctionDeclaration',
          message: 'Use arrow functions instead of function declarations.',
        },
        {
          selector: 'FunctionExpression:not(MethodDefinition > FunctionExpression):not(ArrowFunctionExpression > FunctionExpression)',
          message: 'Use arrow functions instead of function expressions.',
        },
      ],
    },
  },
  {
    files: ['src/resources/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/services/*', '@/stores/*', '@/components/*', '@/pages/*', '@/composables/*', '@/resources/*/../*'],
              message: 'src/resources/** may not import from services, stores, components, pages, composables, or other resources.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/services/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/stores/*', '@/components/*', '@/pages/*', '@/composables/*'],
              message: 'src/services/** may not import from stores, components, pages, or composables.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/stores/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/resources/*'],
              message: 'src/stores/** may not import from resources. Use a service instead.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/components/**/*.{ts,vue}', 'src/pages/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/resources/*'],
              message: 'components/pages may not import from resources directly. Use a service.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/composables/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/resources/*', '@/components/*', '@/pages/*'],
              message: 'src/composables/** may not import from resources, components, or pages.',
            },
          ],
        },
      ],
    },
  },
)
