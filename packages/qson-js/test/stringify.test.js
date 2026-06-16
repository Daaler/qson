import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { stringifyQSON } from "../src/index.ts";

describe("Stringify primitives and empty items", () => {

    test("undefined as root should yield undefined", () => {
        const result = stringifyQSON(undefined);

        assert.strictEqual(result, undefined);
    });

    test("function as root should yield undefined", () => {
        function fn() {};
        const result = stringifyQSON(fn);

        assert.strictEqual(result, undefined);
    });

    test("Date object should work (with .toJSON()", () => {
        const today = new Date();
        const dateString = today.toISOString();
        const result = stringifyQSON(today);

        assert.strictEqual(result, `$${dateString}$`);
    });
});
