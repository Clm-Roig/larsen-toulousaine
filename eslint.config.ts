import tsParser from "@typescript-eslint/parser";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  globalIgnores(["node_modules/", "public/", ".next/"]),
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
        tsconfigRootDir: __dirname,
        extraFileExtensions: [".ts", ".tsx"],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    settings: {
      react: { version: "detect" },
    },
  },
  {
    rules: {
      // TypeScript
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/ban-ts-comment": "off",

      // React
      "react/react-in-jsx-scope": "off",

      // Général
    },
  },
  {
    files: ["api/**/*"],
    rules: {
      "no-console": "off",
    },
  },
]);
