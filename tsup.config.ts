import type { Options } from "tsup"

const config: Options = {
  entry: ["src/index.ts"],
  dts: true,
  format: ["esm", "cjs"],
  sourcemap: true,
  clean: true,
  external: [
    "react",
    "react-dom",
  ],
}

export default config
