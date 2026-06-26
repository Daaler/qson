import { test } from "node:test";
import assert from "node:assert/strict";
import pathTool from "node:path";
import fsp from "node:fs/promises";
import { customRunners } from "./custom-suite-tests.js";
import { stringifyQSON, parseQSON } from "../../src/index.ts";

export async function prepareTests(directory) {
    const tests = await loadTests(directory);
    for (const [testFile, testDefinition] of Object.entries(tests)) {
        const { type, testCases } = testDefinition;
        switch (type) {
            case "valid-pair":
                prepareValidPair(testCases);
                break;
            case "invalid-qson":
                prepareInvadlidQSON(testCases);
                break;
            case "invalid-data":
                prepareInvadlidData(testCases);
                break;
            case "custom":
                prepareCustom(testCases);
                break;
            default: throw new Error(`Unknown test type: ${type} in ${testFile}`);
        }

    }
}

async function loadTests(dir) {
    const tests = {};

    const testFiles = await fsp.readdir(dir);
    for (const testFile of testFiles) {
        if (!testFile.endsWith(".json")) continue;
        const path = pathTool.join(dir, testFile);
        const json = await fsp.readFile(path, "utf-8");
        const test = JSON.parse(json);
        if (!test?.type) continue;

        const testCases = [];
        const { type, description, cases=[], ...rest } = test;
        if (Object.keys(rest).length) testCases.push({ description, ...rest });
        for (const testCase of cases) {
            const { description, ...rest } = testCase;
            const caseDescriptions = `${test.description} - ${testCase.description}`;
            testCases.push({ description: caseDescriptions, ...rest });
        }

        tests[testFile] = { ...test, testCases };
    }

    return tests;
}

function prepareValidPair(testCases) {
    for (const testCase of testCases) {
        const { description, data, qson } = testCase;

        test(`${description} - stringify`, () => {
            const result = stringifyQSON(data);
            assert.deepStrictEqual(result, qson);
        });

        test(`${description} - parse`, () => {
            const result = parseQSON(qson);
            assert.deepStrictEqual(result, data);
        });
    }
}

function prepareInvadlidQSON(testCases) {
    for (const testCase of testCases) {
        const { description, qson } = testCase;

        test(`${description} - parse`, () => {
            let error;
            try {
                parseQSON(qson);
            } catch (e) {
                error = e;
            }

            assert.strictEqual(error.constructor, SyntaxError);
        });
    }
}

function prepareInvadlidData(testCases) {
    for (const testCase of testCases) {
        const { description, data, serializerError } = testCase;

        test(`${description} - stringify`, () => {
            let error;
            try {
                stringifyQSON(data);
            } catch (e) {
                error = e;
            }

            assert.strictEqual(error.constructor, TypeError);
        });
    }
}

function prepareCustom(testCases) {
    if (testCases.length !== 1) throw new Error("Custom definitions must have exactly one test case");
    const testCase = testCases[0];
    const { name } = testCase;
    const prepareFn = customRunners[name];
    if (!prepareFn) {
        console.warn(`No test runner for custom test case: ${name}`);
        return;
    }
    prepareFn(testCase);
}
