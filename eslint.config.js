// @ts-check
import { eslintConfigShwaka } from "eslint-config-shwaka"
import tseslint from "typescript-eslint"

export default tseslint.config(
  ...eslintConfigShwaka,
  {
    files: [
      "**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs",
      "**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts",
    ],
  },
)
