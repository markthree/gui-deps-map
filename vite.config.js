import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { copyFile } from "fs/promises";

export default defineConfig({
  plugins: [solid(), {
    name: "vite-plugin-gen-runtime",
    apply: "build",
    closeBundle() {
      copyFile("src/runtime.js", "dist/runtime.js");
    },
  }],
  build: {
    target: "esnext",
  },
});
