"use strict";

module.exports = {
  env: {
    es6: true,
  },
  root: true,
  rules: {
    "hardsort/object-sort": "error",
  },
  extends: [
    "eslint:recommended",
    "plugin:eslint-plugin/recommended",
    "plugin:node/recommended",
  ],
  plugins: ["hardsort"],
  overrides: [
    {
      env: { mocha: true },
      files: ["tests/**/*.js"],
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  ignorePatterns: ["**/*.md", "**/*.test.js"],
};
