// @ts-check
import { eslintConfigShwakaOnsave } from "@shwaka/eslint-config-shwaka"
import tseslint from "typescript-eslint"

export default tseslint.config(
  ...eslintConfigShwakaOnsave,
  {
    files: [
      "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs",
      "**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts",
    ],
  },
)
