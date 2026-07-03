import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import { createQueryString } from "@qson/js";
import { qsonQueryParser } from "../src/index.ts";

const isQSON = (key) => key !== "_id";

describe("Smoke test", () => {
    const original = { a: 1, hello: "hello", arr: [null, true, false, -4, "Oh &no"], obj: { world: "world", "": 1.5 } };
    const expected = "(a:1,arr:@(null,true,false,-4,$Oh%20%26no$),hello:$hello$,obj:(:1.5,world:$world$))";

    let listener;
    let port = 0;

    before(() => {
        const ex = express();

        ex.set("query parser", qsonQueryParser({ isQSON }));
        ex.get("/echo1", (request, response) => {
            const { originalUrl, query } = request;
            const questionMarkIndex = originalUrl.indexOf("?");
            const raw = questionMarkIndex >= 0 ? originalUrl.slice(questionMarkIndex + 1) : "";
            const data = { query, raw };
            response.json(data);
        });
        listener = ex.listen(0);
        port = listener.address().port;
    });

    test("With fetch API", async() => {
        const qs = createQueryString({ q: original });
        const result = await fetch(`http://localhost:${port}/echo1?${qs}`);
        const { query, raw } = await result.json();

        assert.deepStrictEqual(query, { q: original });
        assert.deepStrictEqual(raw, `q=${expected}`);
    });

    test("With fetch API", async() => {
        const qs = createQueryString({ _id: "123", q: original }, { isQSON });
        const result = await fetch(`http://localhost:${port}/echo1?${qs}`);
        const { query, raw } = await result.json();

        assert.deepStrictEqual(query, { _id: "123", q: original });
        assert.deepStrictEqual(raw, `_id=123&q=${expected}`);
    });

    test("Usage with URL class", async() => {
        const qs = createQueryString({ _id: "123", q: original }, { isQSON });
        const url = new URL(`echo1/?${qs}`, `http://localhost:${port}`);
        const result = await fetch(url);
        const { query, raw } = await result.json();

        assert.deepStrictEqual(query, { _id: "123", q: original });
        assert.deepStrictEqual(raw, `_id=123&q=${expected}`);
    });

    after(() => {
        listener.close();
    });
});
