import fs from "node:fs";
import pathTool from "node:path";
import { execSync } from "node:child_process";

const pkgRoot = pathTool.resolve(import.meta.dirname, "..");

export const paths = {
    pkgRoot,
    distDirectory: pathTool.resolve(pkgRoot, "dist"),
    cjsDirectory: pathTool.resolve(pkgRoot, "dist/cjs"),
    esmDirectory: pathTool.resolve(pkgRoot, "dist/esm"),
    typesDirectory: pathTool.resolve(pkgRoot, "dist/types"),
};

export function clean() {
    fs.rmSync(paths.distDirectory, { recursive: true, force: true });
}

export function build() {
    clean();

    execSync("pnpm exec tsc -p tsconfig.esm.json", { stdio: "inherit", cwd: paths.pkgRoot });
    execSync("pnpm exec tsc -p tsconfig.cjs.json", { stdio: "inherit", cwd: paths.pkgRoot });
    execSync("pnpm exec tsc -p tsconfig.types.json", { stdio: "inherit", cwd: paths.pkgRoot });

    // --> add inner package.json to cjs -->
    const cjsPackge = { type: "commonjs" };
    const cjsPackgeJSON = JSON.stringify(cjsPackge, null, 2);
    const cjsPackagePath = pathTool.resolve(paths.cjsDirectory, "package.json");
    fs.writeFileSync(cjsPackagePath, cjsPackgeJSON, "utf-8");
    // <-- add inner package.json to cjs <--
}
