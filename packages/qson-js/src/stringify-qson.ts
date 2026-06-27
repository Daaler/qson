import serialize from "./serialize.ts";
import { handleQSONException } from "./qson-exception.ts";
import { Transform } from "./types.ts";

/**
 * Converts a JavaScript value to a Query String Object Notation (QSON) string.
 *
 * @param value A JavaScript value, usually an object or array, to be converted.
 * @param options Seralization options
 * @throws {TypeError} If a circular reference or a unserializable value is found.
 */
export default function stringifyQSON(value:any, options:SerializerOptions={}):string|undefined {
    const { replacer } = options;
    try {
        return serialize(value, { ...options, transform: replacer });
    } catch (exception) {
        handleQSONException(exception, stringifyQSON);
    }
}

/**
 * Options for creating Query String and QSON string.
 */
export interface SerializerOptions {
    /**
     * Sort object keys in canonical order.
     */
    canonical?:boolean;
    /**
     * A function that transforms the results.
     */
    replacer?:Transform|null;
    /**
     * Maximum nesting depth.
     */
    maxDepth?:number;
}
