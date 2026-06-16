import fs from "node:fs";
import pathTool from "node:path";
import { execSync } from "node:child_process";
import { paths, clean } from "./utils.js";

clean();

execSync("tsc -p tsconfig.esm.json", { stdio: "inherit", cwd: paths.pkgRoot });
execSync("tsc -p tsconfig.cjs.json", { stdio: "inherit", cwd: paths.pkgRoot });
execSync("tsc -p tsconfig.types.json", { stdio: "inherit", cwd: paths.pkgRoot });

// --> add inner package.json to cjs -->
const cjsPackge = { type: "commonjs" };
const cjsPackgeJSON = JSON.stringify(cjsPackge, null, 2);
const cjsPackagePath = pathTool.resolve(paths.cjsDirectory, "package.json");
fs.writeFileSync(cjsPackagePath, cjsPackgeJSON, "utf-8");
// <-- add inner package.json to cjs <--
