/* eslint-env node */
module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  ignorePatterns: [".eslintrc.cjs"],
  plugins: ["@typescript-eslint"],
  root: true,
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
}
