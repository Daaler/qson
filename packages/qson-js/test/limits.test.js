import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { stringifyQSON, parseQSON } from "../src/index.ts";

describe("Limits", () => {
    const data_10 = [[[[[[[[[[]]]]]]]]]];
    const data_11 = [[[[[[[[[[[]]]]]]]]]]];
    const qson_10 = "@(@(@(@(@(@(@(@(@(@())))))))))";
    const qson_11 = "@(@(@(@(@(@(@(@(@(@(@()))))))))))";

    describe("stringify", () => {
        test("Depth of 10 is allowed by default", () => {
            const qson = stringifyQSON(data_10);

            assert.strictEqual(qson, qson_10)
        });

        test("Depth of 11 must throw by default", () => {
            let error;
            try {
                stringifyQSON(data_11);
            } catch (e) {
                error = e;
            }

            assert.strictEqual(error?.constructor, Error);
            assert.strictEqual(error.message, "Max nesting depth (10) exceeded");
        });

        test("Depth of 11 can be allowed", () => {
            const qson = stringifyQSON(data_11, { maxDepth: 11 });

            assert.strictEqual(qson, qson_11)
        });
    });

    describe("parse", () => {
        test("Depth of 10 is allowed by default", () => {
            const qson = parseQSON(qson_10);

            assert.deepStrictEqual(qson, data_10)
        });

        test("Depth of 11 must throw by default", () => {
            let error;
            try {
                parseQSON(qson_11);
            } catch (e) {
                error = e;
            }

            assert.strictEqual(error?.constructor, Error);
            assert.strictEqual(error.message, "Max nesting depth (10) exceeded");
        });

        test("Depth of 11 can be allowed", () => {
            const qson = parseQSON(qson_11, { maxDepth: 11 });

            assert.deepStrictEqual(qson, data_11)
        });
    });
});
