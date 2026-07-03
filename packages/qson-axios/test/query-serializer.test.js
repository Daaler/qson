import { after, before, describe, test } from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import { qsonQuerySerializer } from "../src/index.ts";
import { createTestServer } from "./test-server.js";

const isQSON = (key) => key !== "_id";

describe("Smoke test", () => {
    const original = { a: 1, hello: "hello", arr: [null, true, false, -4, "Oh &no"], obj: { world: "world", "": 1.5 } };
    const expected = "(a:1,arr:@(null,true,false,-4,$Oh%20%26no$),hello:$hello$,obj:(:1.5,world:$world$))";

    let server;
    let port;
    let ax;

    before(async () => {
        server = await createTestServer();
        port = server.port;
        ax = axios.create({ baseURL: `http://localhost:${port}`, paramsSerializer: qsonQuerySerializer({ isQSON }) });
    });

    test("GET", async () => {
        const { data } = await ax.get("echo1", { params: { q: original } });
        const { query, raw } = data;

        assert.deepStrictEqual(query, { q: original });
        assert.deepStrictEqual(raw, `q=${expected}`);
    });

    test("GET", async () => {
        const { data } = await ax.get("echo1", { params: { _id: "123", q: original } });
        const { query, raw } = data;

        assert.deepStrictEqual(query, { _id: "123", q: original });
        assert.deepStrictEqual(raw, `_id=123&q=${expected}`);
    });

    after(async() => {
        await server.close();
    });
});
