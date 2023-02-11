#!/usr/bin/env node
import { cwd } from "node:process";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import * as Gluon from "@gluon-framework/gluon";

const isDev = process.env.NODE_ENV === "dev";

const _dirname = typeof __dirname !== "undefined"
  ? __dirname
  : dirname(fileURLToPath(import.meta.url));

const url = isDev
  ? "http://localhost:5173/"
  : resolve(_dirname, "./index.html");

const Window = await Gluon.open(url, { allowHTTP: isDev });

function getPackageJsonPath() {
  return resolve(cwd(), "package.json");
}

Window.ipc.scanDeps = async function () {
  const packageJsonString = await readFile(getPackageJsonPath(), "utf8");
  const packageJson = JSON.parse(packageJsonString);

  const deps = {};
  for (const key in packageJson) {
    if (Object.hasOwnProperty.call(packageJson, key)) {
      if (key.toLocaleLowerCase().includes("dependencies")) {
        deps[key] = packageJson[key];
      }
    }
  }
  return JSON.stringify(deps);
};
