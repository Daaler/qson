import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createQueryString } from "../src/index.ts";

describe("Create query string", () => {
    test("empty", () => {
        const result = createQueryString({});

        assert.strictEqual(result, "");
    });

    test("'isQSON' predicate default: always true", () => {
        const result = createQueryString({ a: "a", b: "b" });

        assert.strictEqual(result, "a=$a$&b=$b$");
    });

    test("'isQSON' predicate: always true", () => {
        const result = createQueryString({ a: "a", b: "b" }, { isQSON: (key) => true });

        assert.strictEqual(result, "a=$a$&b=$b$");
    });

    test("'isQSON' predicate: always false", () => {
        const result = createQueryString({ a: "a", b: "b" }, { isQSON: (key) => false });

        assert.strictEqual(result, "a=a&b=b");
    });

    test("'isQSON' predicate", () => {
        const result = createQueryString({ a: "a", b: "b" }, { isQSON: (key) => key === "a" });

        assert.strictEqual(result, "a=$a$&b=b");
    });
});
