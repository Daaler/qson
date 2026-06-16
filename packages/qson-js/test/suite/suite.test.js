import { describe } from "node:test";
import pathTool from "node:path";
import { prepareTests } from "./prepare-suite-tests.js";

const basePath = pathTool.resolve(import.meta.dirname, "../../../../test-corpus");

describe("QSON DSL test suite", () => {

    describe("Valid test cases", async() => {
        const directory = pathTool.join(basePath, "valid");
        await prepareTests(directory);
    });

    describe("Invalid test cases", async() => {
        const directory = pathTool.join(basePath, "invalid");
        await prepareTests(directory);
    });
});
