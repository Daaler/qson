import { describe, test } from "node:test";
import assert from "node:assert/strict";
import pathTool from "node:path";
import fs from "node:fs";
import { execSync } from "node:child_process";

const executable = pathTool.resolve(import.meta.dirname, "fixtures/qson-increment-version.js");

const cwd = pathTool.resolve(import.meta.dirname, "./zz-working/increment-version");
const githubOutputPath = pathTool.resolve(cwd, "github-output");
const packageJSONPath = pathTool.resolve(cwd, "package.json");
const oldPackageJSON = JSON.stringify({
    "name": "my-package",
    "version": "0.2.2",
    "author": "Developer Duck",
}, null, 4);
const expectedPackageJSON = JSON.stringify({
    "name": "my-package",
    "version": "0.2.3",
    "author": "Developer Duck",
}, null, 4);

describe("increment-version.js", () => {

    test("Increment minor version on 0.2.2 to 0.2.3", () => {
        fs.rmSync(cwd, { recursive: true, force: true });
        fs.mkdirSync(cwd, { recursive: true });
        fs.writeFileSync(githubOutputPath, "", "utf-8");
        fs.writeFileSync(packageJSONPath, oldPackageJSON, "utf-8");
        execSync(executable, { stdio: "inherit", cwd, env: { ...process.env, GITHUB_OUTPUT: githubOutputPath } });
        const githubOuput = fs.readFileSync(githubOutputPath, "utf-8");
        const newPackageJSON = fs.readFileSync(packageJSONPath, "utf-8");

        assert.strictEqual(githubOuput, "next_version=0.2.3\n");
        assert.strictEqual(newPackageJSON, expectedPackageJSON);
    });
});
