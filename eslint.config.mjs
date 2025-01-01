// @ts-nocheck // TypeScriptの型チェックを無効化
import js from "@eslint/js";
import * as tseslint from "@typescript-eslint/eslint-plugin";
import * as tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";

const config = [
  {
    linterOptions: {
      reportUnusedDisableDirectives: true,
    }
  },
  
  {
    files: ["**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}"],
    ...js.configs.recommended,
    rules: {
      'no-unused-vars': 'off',
    }
  },
  
  {
    files: ["**/*.{ts,tsx,mtsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: ["./tsconfig.json"]
      }
    },
    plugins: {
      "@typescript-eslint": tseslint
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_" // catch節の変数も_で始まる場合は無視
      }],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-case-declarations": "off",
      "no-constant-condition": ["error", { "checkLoops": false }]
    }
  },

  prettier,

  {
    ignores: ["dist/**", "node_modules/**", "*.js"],
    languageOptions: {
      sourceType: "module",
      globals: {
        document: "readonly",
        navigator: "readonly",
        window: "readonly",
        require: "readonly",
        process: "readonly",
        global: "readonly"
      }
    }
  }
];

export default config;