import { viteConfig } from '@repo/eslint-config/vite';

/** @type {import("eslint").Linter.Config} */
export default [
  { ignores: ['.agents/**'] },
  ...viteConfig,
  {
    files: ['**/shared/ui/components/**/*.tsx'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
];
