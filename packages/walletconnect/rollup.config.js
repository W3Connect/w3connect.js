// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import styles from "rollup-plugin-styles";
export default [
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.cjs.js",
      format: "cjs",
    },
    plugins: [typescript(), styles()],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.es.js",
      format: "es",
    },
    plugins: [typescript(), styles()],
  },
];
