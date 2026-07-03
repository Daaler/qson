import fs from "node:fs";
import pathTool from "node:path";
import { execSync } from "node:child_process";
import { inc } from "semver";

let noBranchCheck = false;
let noTagCheck = false;
let noGitChecks = false;
let dryRun = false;
let minor = false;

for (const arg of process.argv.slice(2)) {
    switch (arg) {
        case "--no-branch-check":
            noBranchCheck = true;
            break;
        case "--no-tag-check":
            noTagCheck = true;
            break;
        case "--no-git-checks":
            noGitChecks = true;
            break;
        case "--dry-run":
            dryRun = true;
            break;
        case "--minor":
            minor = true;
            break;
        default:
            throw new Error(`Unknown cli argument: ${arg}`);
    }
}

const pkgRoot = process.cwd();
const distDirectory = pathTool.resolve(pkgRoot, "dist");

export const paths = {
    pkgRoot,
    distDirectory,
    cjsDirectory: pathTool.resolve(distDirectory, "cjs"),
    esmDirectory: pathTool.resolve(distDirectory, "esm"),
    typesDirectory: pathTool.resolve(distDirectory, "types"),
};

export function clean() {
    fs.rmSync(paths.distDirectory, { recursive: true, force: true });
}

export function build() {
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

export function release() {
    const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
    if (branch !== "master") {
        const message = `Commit is not contained in master branch: ${branch}`;
        if (noBranchCheck) {
            console.log(message);
        } else {
            throw new Error(message);
        }
    }

    const expectedRef = getProjectRef();
    const ref = process.env.GITHUB_REF || "";
    if (ref !== expectedRef) {
        const message = `Reference mismatch. Expected: ${expectedRef}. Got: ${ref}`;
        if (noTagCheck) {
            console.log(message);
        } else {
            throw new Error(message);
        }
    }

    const publishCommand = `pnpm publish ${dryRun ? "--dry-run" : "--access public"}${noGitChecks ? " --no-git-checks" : ""}`;
    execSync(publishCommand, { stdio: "inherit", cwd: paths.pkgRoot });
}

function getProjectRef() {
    if (!process.env.npm_package_name.startsWith("@qson/"))
        throw new Error(`Invalid project prefix at 'name' in package.json: ${process.env.npm_package_name}`);
    const name = `qson-${process.env.npm_package_name.slice(6)}`;
    const version = process.env.npm_package_version;
    const expectedRef = `refs/tags/${name}/v${version}`;
    return expectedRef;
}

export function incrementVersion() {
    const packageJSONPath = pathTool.join(paths.pkgRoot, "package.json");
    const packageJSON = fs.readFileSync(packageJSONPath, "utf-8");
    const oldPackage = JSON.parse(packageJSON);
    const releaseType = oldPackage.version.startsWith("0.") || !minor ? "patch" : "minor";
    const newPackage = { ...oldPackage };
    newPackage.version = inc(oldPackage.version, releaseType);
    const newPackageJSON = JSON.stringify(newPackage, null, 4);
    console.log(`${dryRun ? "Skipping: " : ""} Incrementing version in package.json from ${oldPackage.version} to ${newPackage.version}`);
    if (dryRun) return;
    fs.writeFileSync(packageJSONPath, newPackageJSON);
    if (!process.env.GITHUB_OUTPUT) return;
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `next_version=${newPackage.version}\n`);
}
