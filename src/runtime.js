#!/usr/bin/env node
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import * as Gluon from "@gluon-framework/gluon";

const isDev = process.env.NODE_ENV === "dev";

const _dirname = typeof __dirname !== "undefined"
  ? __dirname
  : dirname(fileURLToPath(import.meta.url));

const url = isDev
  ? "http://localhost:5173/"
  : resolve(_dirname, "./index.html");

Gluon.open(url, { allowHTTP: isDev });
