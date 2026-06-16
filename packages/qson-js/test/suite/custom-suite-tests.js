import { test } from "node:test";
import assert from "node:assert";
import { stringifyQSON } from "../../src/index.ts";

export const customRunners = {};

customRunners.circularReference = (testCase) => {
    const { description } = testCase;

    test(description, () => {
        const obj1 = {};
        const obj2 = { obj1 };
        obj1.obj2 = obj2;
        let qsonError;
        try {
            stringifyQSON(obj1);
        } catch (e) {
            qsonError = e;
        }

        assert.strictEqual(qsonError.constructor, TypeError);
        assert.strictEqual(qsonError.message.slice(0, 37), "Converting circular structure to QSON");
    });
};
