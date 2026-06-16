import fs from "node:fs";
import pathTool from "node:path";

const pkgRoot = pathTool.resolve(import.meta.dirname, "..");

export const paths = {
    pkgRoot,
    cjsDirectory: pathTool.resolve(pkgRoot, "cjs"),
    esmDirectory: pathTool.resolve(pkgRoot, "esm"),
    typesDirectory: pathTool.resolve(pkgRoot, "types"),
};

export function clean() {
    fs.rmSync(paths.cjsDirectory, { recursive: true, force: true });
    fs.rmSync(paths.esmDirectory, { recursive: true, force: true });
    fs.rmSync(paths.typesDirectory, { recursive: true, force: true });
}
