import parse from "./parse.ts";
import { handleQSONException } from "./qson-exception.ts";
import { Transform } from "./types.ts";

/**
 * Converts a Query String Object Notation (QSON) string into an object.
 *
 * @param text A valid QSON string.
 * @throws {SyntaxError} If text is not valid JSON.
 */
export default function parseQSON(text:string, options:ParserOptions={}):any {
    const { reviver, maxDepth } = options;
    try {
        return parse(text, { transform: reviver, maxDepth });
    } catch (exception) {
        handleQSONException(exception, parseQSON);
    }
}

/**
 * Options for QSON parser.
 */
export interface ParserOptions {
    /**
     * A function that transforms the results.
     */
    reviver?:Transform;
    /**
     * Maximum nesting depth.
     */
    maxDepth?:number;
}
