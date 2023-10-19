/* eslint-env node */
module.exports = {
  extends: [
    "@strv/eslint-config-node/v20",
    "@strv/eslint-config-node/optional",
    "@strv/eslint-config-typescript",
    "@strv/eslint-config-typescript/style",
  ],
  plugins: ["@typescript-eslint/eslint-plugin"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  root: true,
}
