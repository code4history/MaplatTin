// ESLint の設定（nov26-m8-t5・NayutaProducts#33）。eslint.config.js と .mjs の 2 重をこの 1 つにした。形は m8 設計の C-m8-1
import js from "@eslint/js";
import tseslint from "typescript-eslint"; // typescript-eslint の recommended を当てる。TS が検査する no-undef・no-redeclare 等を off にする（eslint-recommended）
import prettier from "eslint-config-prettier"; // 書式の規則は prettier に任せる。no-unexpected-multiline 等の書式の規則を off にする
import globals from "globals";

export default [
  // 全体の除外は ignores だけを持つ要素に書く（C-m8-1 (b)）
  { ignores: ["dist/**", "node_modules/**", "coverage/**", "docs/**"] },
  { linterOptions: { reportUnusedDisableDirectives: true } },
  // recommended は独立した要素に置き、files を付けない（C-m8-1 (a)）
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { ecmaVersion: 2022, sourceType: "module", globals: { ...globals.browser, ...globals.node } },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    rules: {
      "no-undef": "off", // TS では未定義の識別子を tsc（pnpm run typecheck）が検査する（typescript-eslint の推奨。eslint-recommended も off にする）
      "no-unused-vars": "off", // @typescript-eslint/no-unused-vars（warn・_ 始まりの引数を除外）で代替する（typescript-eslint の recommended も off にする）
    },
  },
  prettier,
];
