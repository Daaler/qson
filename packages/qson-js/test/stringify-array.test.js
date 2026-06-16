import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { stringifyQSON } from "../src/index.ts";

describe("Stringify arrays", () => {

    test("Anything that cannot be serialized (except BigInt) is converted to null", () => {
        const result = stringifyQSON([undefined,, () => {}]);

        assert.strictEqual(result, "@(null,null,null)");
    });
});
