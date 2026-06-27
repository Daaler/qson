import { handleQSONException } from "./qson-exception.ts";
import { SerializerOptions } from "./stringify-qson.ts";
import { Obj, IsQSON } from "./types.ts";
import buildQueryString from "./build-query-string.ts";

/**
 * Converst a JavaScript object to a query string where values are serialized
 * to Query String Object Notation (QSON).
 *
 * Notice: If you want to make a plain QSON string, use
 * stringifyQSON() instead.
 *
 * @param query A JavaScript object where values are any QSON (JSON) compatible data.
 * @param options Parsing options.
 * @returns Qeury string without leading '?'.
 * @throws {TypeError} If a circular reference or a unserializable value is found.
 */
export default function createQueryString(query:Obj, options:CreateQueryStringOptions={}) {
    const { replacer } = options;
    try {
        return buildQueryString(query, { ...options, transform: replacer });
    } catch (exception) {
        handleQSONException(exception, createQueryString);
    }
}

export interface CreateQueryStringOptions extends SerializerOptions {
    /**
     * Filter which keys are serialized to QSON and which to raw string.
     */
    isQSON?:IsQSON;
}
