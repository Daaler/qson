import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { stringifyQSON } from "../src/index.ts";

describe("BigInt is not supported", () => {
    test("BigInt should throw", () => {
        let error;
        try { stringifyQSON(BigInt(1)) } catch (e) { error = e };

        assert.strictEqual(error.constructor, TypeError);
        assert.strictEqual(error.message.slice(0, 37), "Do not know how to serialize a BigInt")
    })
});
