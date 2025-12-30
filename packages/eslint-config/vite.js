import pluginReactRefresh from "eslint-plugin-react-refresh";
import { config as reactConfig } from "./react-internal.js";

/**
 * ESLint config for Vite + React applications
 *
 * @type {import("eslint").Linter.Config}
 */
export const viteConfig = [
  ...reactConfig,
  pluginReactRefresh.configs.vite,
];

