import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { stringifyQSON } from "../src/index.ts";

describe("<object>.toJSON() and replacer callback", () => {
    test("<object>.toJSON() is run once (not recursively)", () => {
        const a1 = {
            name: "a1",

            toJSON() {
                return a2;
            }
        }

        const a2 = {
            name: "a2",

            toJSON() {
                return a3;
            }
        }

        const a3 = {
            name: "a3",
        }

        const qson = stringifyQSON(a1);
        assert.strictEqual(qson, "(name:$a2$)");
    });

    test("Replacer function is run once (not recursively)", () => {
        const b1 = {
            replace: "replace_me_0",
        }

        const qson = stringifyQSON(b1, {
            replacer(key, value) {
                if (value === "replace_me_0") return "replace_me_1";
                if (value === "replace_me_1") return "replace_me_2";
                return value;
            }
        })

        assert.strictEqual(qson, "(replace:$replace_me_1$)");
    });

    test("<object>.toJSON() is not run if object originates from replacer function", () => {
        const x = {
            r: "not replaced",
        };

        const y = {
            y: "this_is_it",
            toJSON() {
                return "wrongly replaced by toJSON";
            }
        };

        const qson = stringifyQSON(x, {
            replacer(key, value) {
                if (key === "r") return y;
                return value;
            }
        });

        assert.strictEqual(qson, "(r:(y:$this_is_it$))");
    });

    test("Replacer is run on value returned by toJSON", () => {
        const c1 = {
            replace: {
                "name": "c2",
                toJSON() {
                    return "replaced";
                },
            },
        };

        const qson = stringifyQSON(c1, {
            replacer(key, value) {
                if (value === "replaced") return "from_toJSON";
                return value;
            }
        });

        assert.strictEqual(qson, "(replace:$from_toJSON$)");
    });
});
