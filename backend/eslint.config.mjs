// @ts-check

import tseslint from "typescript-eslint"
import eslint from "@eslint/js"

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        project: "./tsconfig.json",
      },
    },
    rules: {
      "require-await": "off",
      "@typescript-eslint/require-await": "error",
      "no-return-await": "off",
      "@typescript-eslint/return-await": ["error", "always"],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
)
