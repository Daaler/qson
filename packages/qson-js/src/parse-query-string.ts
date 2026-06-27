import { ParserOptions } from "./parse-qson.ts";
import { handleQSONException } from "./qson-exception.ts";
import { IsQSON } from "./types.ts";
import buildQueryObject from "./build-query-object.ts";

/**
 * Converts a Query String with QSON values into an object.
 *
 * @param text A valid Query String with QSON values without leading '?'.
 * @throws {SyntaxError} If text is not valid Query String or values are not valid QSON.
 */
export default function parseQueryString(text:string, options:ParseQueryStringOptions={}) {
    const { reviver } = options;
    try {
        return buildQueryObject(text, { ...options, transform: reviver });
    } catch (exception) {
        handleQSONException(exception, parseQueryString);
    }
}

export interface ParseQueryStringOptions extends ParserOptions {
    /**
     * Filter which keys are parsed as QSON and which as raw string.
     */
    isQSON?:IsQSON;
}
