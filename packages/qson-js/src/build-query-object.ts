import parse from "./parse.ts";
import { Options as StateOptions } from "./state.ts";
import { Obj, IsQSON } from "./types.ts";

export default function buildQueryObject(text:string, options:Settings) {
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

interface Settings extends StateOptions {
    isQSON?:IsQSON;
}
