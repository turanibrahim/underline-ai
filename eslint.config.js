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
)
