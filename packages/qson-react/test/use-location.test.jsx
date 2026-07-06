import React, { useEffect } from "react";
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { render } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { useLocation } from "../src/index.ts";

describe("useLocation hook", () => {
	let query = null;

    function Test() {
        const navigate = useNavigate();
        useEffect(() => {
            navigate({ pathname: "/abc", search: "?a=$a$&arr=@($b$,null,1.2)" });
        },[navigate]);

        return <div>Ok</div>;
    }

    function LocationTest() {
        const location = useLocation();
        useEffect(() => {
			query = location.query;
        },[location]);

        return <div>Ok2</div>
    }

    test("Parses QSON query string and returns query object.", () => {
        render(
            <MemoryRouter>
                <Test />
                <LocationTest />
            </MemoryRouter>
        );

		assert.deepStrictEqual(query,{ a:"a",arr:[ "b",null,1.2 ] });
    });    
});
