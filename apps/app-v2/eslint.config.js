import { viteConfig } from '@repo/eslint-config/vite';

/** @type {import("eslint").Linter.Config} */
export default [
  ...viteConfig,
  {
    files: ['**/shared/ui/components/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
];
