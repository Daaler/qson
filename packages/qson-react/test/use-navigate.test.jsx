import React, { useEffect } from "react";
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { render } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router";
import { useNavigate } from "../src/index.ts";

describe("useNavigate hook", () => {
    let href = "";

    function Test() {
        const navigate = useNavigate();
        useEffect(() => {
            navigate("/abc",{ query:{ a:"a",arr:[ "b",null,1.2 ] } });
        },[navigate]);

        return <div>Ok</div>;
    }

    function LocationTest() {
        const location = useLocation();
        useEffect(() => {
            href = location.search;
        },[location]);

        return <div>Ok2</div>
    }

    test("Serializes and sets QSON query string from query object", () => {
        render(
            <MemoryRouter>
                <Test />
                <LocationTest />
            </MemoryRouter>
        );

        assert.strictEqual(href, "?a=$a$&arr=@($b$,null,1.2)");
    });    
});
