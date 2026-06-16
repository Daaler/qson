import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { stringifyQSON } from "../src/index.ts";

describe("Stringify numbers", () => {
    test("NaN should always be converted to null", () => {
        const result1 = stringifyQSON(NaN);
        const result2 = stringifyQSON(0/0);

        assert.strictEqual(result1, "null");
        assert.strictEqual(result2, "null");
    });

    test("Infinity should always be converted to null", () => {
        const result1 = stringifyQSON(Infinity);
        const result2 = stringifyQSON(1/0);

        assert.strictEqual(result1, "null");
        assert.strictEqual(result2, "null");
    });
});
