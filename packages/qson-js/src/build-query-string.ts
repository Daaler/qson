import { encodeQsKey } from "./encode-string.ts";
import { Options as StateOptions } from "./serializer-state.ts";
import serialize from "./serialize.ts";
import { Obj, IsQSON } from "./types.ts";

export default function buildQueryString(query:Obj, options:Options) {
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
    const { isQSON } = options;
    const qsKey = encodeQsKey(key);
    const qsValue = !isQSON || isQSON(key) ? serialize(value, options) : encodeURIComponent(value);
    const qsItem = `${qsKey}=${qsValue}`;
    return qsItem;
}

interface Options extends StateOptions {
    isQSON?:IsQSON;
}
