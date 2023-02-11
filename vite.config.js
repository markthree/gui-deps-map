import { execa } from "execa";
import { resolve } from "path";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import Solid from "vite-plugin-solid";
import { copyFile } from "fs/promises";
import { debounce } from "perfect-debounce";

const RUNTIME_SRC = resolve(__dirname, "src/runtime.js");

const RUNTIME_DIST = resolve(__dirname, "dist/runtime.js");

let cleanupRuntime;
let started = false;
function startRuntime() {
  const { cancel } = execa("node", [RUNTIME_SRC], {
    stdin: "inherit",
    stderr: "inherit",
    stdout: "inherit",
    env: {
      NODE_ENV: "dev",
    },
  });
  cleanupRuntime = function () {
    cancel();
    started = false;
  };
  started = true;
}

/**
 * @type {import("vite").Plugin}
 */
const GenRuntime = {
  name: "vite-plugin-gen-runtime",
  apply: "build",
  closeBundle() {
    copyFile(RUNTIME_SRC, RUNTIME_DIST);
  },
};

/**
 * @type {import("vite").Plugin}
 */
const StartRuntime = {
  name: "vite-plugin-start-runtime",
  apply: "serve",
  configureServer({ watcher }) {
    if (!started) {
      startRuntime();
    }

    watcher.on(
      "change",
      debounce((path) => {
        if (path !== RUNTIME_SRC) {
          return;
        }
        if (cleanupRuntime) {
          cleanupRuntime();
        }
        startRuntime();
      }, 1500),
    );
  },
  closeBundle() {
    cleanupRuntime();
  },
};

export default defineConfig({
  plugins: [UnoCSS(), Solid(), GenRuntime, StartRuntime],
  build: {
    target: "esnext",
  },
});
