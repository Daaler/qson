import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { stringifyQSON } from "../src/index.ts";

describe("Object serialization", () => {

    test("Anything that cannot be serialized (except BigInt) is discarded", () => {
        const result = stringifyQSON({ a: undefined, b: () => {} });

        assert.strictEqual(result, "()");
    });
});
