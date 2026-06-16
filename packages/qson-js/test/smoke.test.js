import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { stringifyQSON, parseQSON, createQueryString } from "../src/index.ts";

describe("Smoke test", () => {
    const original = { a: 1, hello: "hello", arr: [null, true, false, -4, "Oh &no"], obj: { world: "world", "": 1.5 } };
    const expected = "(a:1,arr:@(null,true,false,-4,$Oh%20%26no$),hello:$hello$,obj:(:1.5,world:$world$))";
    const notCanonical = "(a:1,hello:$hello$,arr:@(null,true,false,-4,$Oh%20%26no$),obj:(world:$world$,:1.5))";

    test("stringify", () => {
        const result = stringifyQSON(original);

        assert.strictEqual(result, expected);
    });

    test("stringify - non canonical", () => {
        const result = stringifyQSON(original, { canonical: false });

        assert.strictEqual(result, notCanonical);
    });

    test("parse", () => {
        const obj = parseQSON(expected);

        assert.deepStrictEqual(obj, original);
    });

    test("Usage with URL class", () => {
        const afterURL1 = new URL(`/?q=${expected}`, "http://localhost").search;
        const qs2 = createQueryString({ q: original });
        const afterURL2 = new URL(`/?${qs2}`, "http://localhost").search;

        assert.strictEqual(afterURL1, `?q=${expected}`);
        assert.strictEqual(afterURL2, `?q=${expected}`);
    });
});
