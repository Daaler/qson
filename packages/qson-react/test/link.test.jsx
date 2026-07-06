import React from "react";
import { test } from "node:test";
import assert from "node:assert/strict";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Link } from "../src/index.ts";

test("Renders link", () => {
    render(
        <MemoryRouter>
            <Link to="/foo" query={{ a:"a",arr:[ "b",null,1.2 ] }}>Foo</Link>
        </MemoryRouter>
    );

    const link = screen.getByRole("link");
    const href = link.getAttribute("href");

    assert.strictEqual(href, "/foo?a=$a$&arr=@($b$,null,1.2)");
});
