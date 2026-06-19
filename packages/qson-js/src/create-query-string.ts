import { encodeQsKey } from "./encode-string.ts";
import { handleQSONException } from "./qson-exception.ts";
import { Options } from "./serializer-state.ts";
import { SerializerOptions } from "./stringify-qson.ts";
import serialize from "./serialize.ts";
import { Obj } from "./types.ts";

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
export default function createQueryString(query:Obj, options:SerializerOptions={}) {
    const { canonical=true, replacer, maxDepth } = options;
    try {
        return _createQueryString(query, { canonical, transform: replacer, maxDepth });
    } catch (exception) {
        handleQSONException(exception, createQueryString);
    }
}

function _createQueryString(query:Obj, options:Options) {
    const { canonical } = options;
    const method = canonical ? createItemsCanonical : createItems;
    const qsItems = method(query, options);
    const qs = qsItems.join("&");
    return qs;
}

function createItems(query:Obj, options:Options) {
    const items:string[] = [];
    for (const [key, value] of Object.entries(query)) {
        const qsItem = createItem(key, value, options);
        items.push(qsItem);
    }
    return items;
}

function createItemsCanonical(query:Obj, options:Options) {
    const items:string[] = [];
    const keys = Object.keys(query).sort();
    for (const key of keys) {
        const value = query[key];
        const qsItem = createItem(key, value, options);
        items.push(qsItem);
    }
    return items;
}

function createItem(key:string, value:any, options:Options) {
    const qsKey = encodeQsKey(key);
    const qsonValue = serialize(value, options);
    const qsItem = `${qsKey}=${qsonValue}`;
    return qsItem;
}
