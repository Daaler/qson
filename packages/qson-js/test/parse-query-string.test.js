import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { parseQueryString } from "../src/index.ts";

describe("Stringify primitives and empty items", () => {
    test("empty string", () => {
        const result = parseQueryString("");

        assert.deepStrictEqual(result, {});
    });

    test("'isQSON' predicate default: always true", () => {
        const result = parseQueryString("a=$a$&b=$b$");

        assert.deepStrictEqual(result, { a: "a", b: "b" });
    });

    test("'isQSON' predicate: always true", () => {
        const result = parseQueryString("a=$a$&b=$b$", { isQSON: (key) => true });

        assert.deepStrictEqual(result, { a: "a", b: "b" });
    });

    test("'isQSON' predicate: always false", () => {
        const result = parseQueryString("a=a&b=b", { isQSON: (key) => false });

        assert.deepStrictEqual(result, { a: "a", b: "b" });
    });

    test("'isQSON' predicate", () => {
        const result = parseQueryString("a=$a$&b=b", { isQSON: (key) => key === "a" });

        assert.deepStrictEqual(result, { a: "a", b: "b" });
    });
});
