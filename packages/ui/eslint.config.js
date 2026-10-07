import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  ...tseslint.configs.strict,
  reactHooks.configs.flat["recommended-latest"],
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]);
