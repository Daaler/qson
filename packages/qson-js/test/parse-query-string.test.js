import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { parseQueryString } from "../src/index.ts";

describe("Stringify primitives and empty items", () => {
    test("empty string", () => {
        const result = parseQueryString("");

        assert.deepStrictEqual(result, {});
    });
});
