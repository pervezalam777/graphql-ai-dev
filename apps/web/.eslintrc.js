export default {
  ignore: ['dist', 'node_modules', '.git', '.cache'],
  root: true,
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
      ],
      plugins: ['@typescript-eslint', 'react-hooks'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        '@typescript-eslint/consistent-type-imports': 'warn',
        'react-hooks/exhaustive-deps': 'error',
      },
    },
  ],
};
