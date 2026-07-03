import http from "node:http";
import { URL } from "node:url";
import { parseQueryString } from "@qson/js";

export async function createTestServer() {
    const server = http.createServer((request, response) => {
        const url = new URL(request.url, "http://localhost");
        const raw = url.search.slice(1);
        const requestInfo = {
            raw,
            query: parseQueryString(raw, { isQSON: (key) => key !== "_id" }),
        };
        const payload = JSON.stringify(requestInfo);

        switch (url.pathname) {
            case "/echo1":
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(payload);
                break;
            default:
                response.status = 404;
                response.end("404 Not found");
        }
    });

    await new Promise((resolve) => {
        server.listen(0, resolve);
    });

    const address = server.address();

    return {
        server,
        port: address.port,
        close: () =>
            new Promise((resolve, reject) =>
                server.close((err) => (err ? reject(err) : resolve()))
            ),
    };
}
