import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import jestPlugin from "eslint-plugin-jest";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default tseslint.config(
  // 1. Equivale ao "eslint:recommended" da sua imagem
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,

  // 2. Equivale ao "plugin:jest/recommended" da sua imagem
  jestPlugin.configs["flat/recommended"],

  {
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": hooksPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...hooksPlugin.configs.recommended.rules,

      // 3. Equivale ao "next/core-web-vitals" da sua imagem
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,

      "react/react-in-jsx-scope": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  {
    ignores: [".next/", "node_modules/", "dist/"],
  },

  // 4. Equivale ao "prettier" da sua imagem (DEVE ser sempre o último da lista)
  prettierConfig,
);
