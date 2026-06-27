import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
    {
        files: [
            "./packages/qson-js/**/*.{ts,js,json}",
            "./test-corpus/**/*.json",
            "./eslint.config.js",
            "./package.json",
        ],
        ignores: [
            "./packages/qson-js/cjs/**",
            "./packages/qson-js/esm/**",
            "./packages/qson-js/types/**",
            "./packages/qson-js/node_modules/**",
            "./packages/qson-js/zz-*/**",
        ],
        languageOptions: {
            globals: globals.browser,
            parser: tseslint.parser,
        },
        plugins: {
            import: importPlugin,
        },
        rules: {
            "no-tabs": "error",
            "quotes": ["error", "double", { "avoidEscape": true }],
            "no-trailing-spaces": "error",
            "eol-last": ["error", "always"],
            "indent": ["error", 4, { flatTernaryExpressions: true, SwitchCase: 1 }],
            "import/extensions": ["error", "always", { ignorePackages: true }],
            "comma-spacing": ["error", { before: false, after: true }],
            "key-spacing": ["error", { beforeColon: false, afterColon: true }],
            "array-bracket-spacing": ["error", "never"],
            "object-curly-spacing": ["error", "always"],
            "func-call-spacing": ["error", "never"],
            "space-in-parens": ["error", "never"],
            "arrow-spacing": ["error", { before: true, after: true }],
            "block-spacing": ["error", "always"],
            "keyword-spacing": ["error", { before: true, after: true }],
            "space-before-blocks": ["error", "always"],
            "semi-spacing": ["error", { before: false, after: true, }],
        },
        settings: {
            "import/resolver": { node: { extensions: [".ts", ".js"] } },
        },
    },
]);
