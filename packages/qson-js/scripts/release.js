#!/usr/bin/env node
import process from "node:process";
import { execSync } from "node:child_process";
import { paths, build } from "./utils.js";

let noBranchCheck = false;
let noTagCheck = false;
let noGitChecks = false;
let dryRun = false;

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
    default:
        throw new Error(`Unknown cli argument: ${arg}`);
    }
}

const branch = execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
if (branch !== "master") {
    const message = "Commit is not contained in master branch";
    if (noBranchCheck) {
        console.log(message);
    } else {
        throw new Error(message);
    }
}

const expectedRef = `refs/tags/qson-js/v${process.env.npm_package_version}`;
const ref = process.env.GITHUB_REF || "";
if (ref !== expectedRef) {
    const message = `Reference mismatch. Expected: ${expectedRef}. Got: ${ref}`;
    if (noTagCheck) {
        console.log(message);
    } else {
        throw new Error(message);
    }
}

build();

const publishCommand = `pnpm publish ${dryRun ? "--dry-run" : "--access public"}${noGitChecks ? " --no-git-checks" : ""}`;
execSync(publishCommand, { stdio: "inherit", cwd: paths.pkgRoot });
