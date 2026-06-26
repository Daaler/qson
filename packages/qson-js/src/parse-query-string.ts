import parse from "./parse.ts";
import { ParserOptions } from "./parse-qson.ts";
import { Options as StateOptions } from "./state.ts";
import { handleQSONException } from "./qson-exception.ts";
import { Obj, IsQSON } from "./types.ts";

/**
 * Converts a Query String with QSON values into an object.
 *
 * @param text A valid Query String with QSON values without leading '?'.
 * @throws {SyntaxError} If text is not valid Query String or values are not valid QSON.
 */
export default function parseQueryString(text:string, options:Options={}) {
    const { reviver, isQSON, maxDepth } = options;
    try {
        return _parseQueryString(text, { isQSON, transform: reviver, maxDepth });
    } catch (exception) {
        handleQSONException(exception, parseQueryString);
    }
}

function _parseQueryString(text:string, options:Settings) {
    const { isQSON } = options;
    const query:Obj = {};
    if (!text) return query;
    const items = text.split("&");
    for (const item of items) {
        const [qsKey, qsValue] = item.split("=", 2);
        const key = decodeURIComponent(qsKey);
        const value = !isQSON || isQSON(key) ? parse(qsValue, options) : decodeURIComponent(qsValue);
        query[key] = value;
    }
    return query;
}

interface Options extends ParserOptions {
    /**
     * Filter which keys are parsed as QSON and which as raw string.
     */
    isQSON?:IsQSON;
}

interface Settings extends StateOptions {
    isQSON?:IsQSON;
}
