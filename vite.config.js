import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import Solid from "vite-plugin-solid";
import { copyFile } from "fs/promises";

export default defineConfig({
  plugins: [UnoCSS(), Solid(), {
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
