import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
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

        settings: {
            react: { version: "detect" },
        },

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
            "no-console": "error",
        },
    },
];
