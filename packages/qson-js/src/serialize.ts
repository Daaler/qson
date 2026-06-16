import SerializerState, { Options } from "./serializer-state.ts";
import { Key } from "./types.ts";
import { encodeString, encodeKey } from "./encode-string.ts";
import { QSONTypeException } from "./qson-exception.ts";
import { Obj } from "./types.ts";

export default function serialize(data:any, options:Options):string|undefined {
    const state = new SerializerState(options);
    const qson = serializeItem(state, { "": data }, "(root)", data) || undefined;
    return qson;
}

function serializeItem(state:SerializerState, parent:any, key:Key, data:any):string {
    state.enter(key);
    let item = data;
    if (typeof data === "object" && data !== null && typeof data.toJSON === "function") item = data.toJSON();
    if (state.hasTransform) item = state.transform(parent, key, item);
    const qson = _serializeData(state, item); // pass final item here
    state.leave();
    return qson;
}

function _serializeData(state:SerializerState, data:any):string {
    switch (typeof data) {
    case "number":
        if (!Number.isFinite(data)) return "null";
        return `${data}`.replace("+", "");
    case "boolean":
        return data ? "true" : "false";
    case "string":
        return serializeString(data);
    case "object":
        if (data === null) return "null";
        if (Array.isArray(data)) return serializeArray(state, data);
        return serializeObject(state, data);
    case "bigint":
        throw new QSONTypeException(state, "Do not know how to serialize a BigInt");
    }
    return "";
}

function serializeObject(state:SerializerState, object:Obj):string {
    state.pushReference(object);
    const qson = _serializeObject(state, object);
    state.popReference();
    return qson;
}

function _serializeObject(state:SerializerState, object:Obj):string {
    const { canonical } = state;
    const method = canonical ? serializeObjectEntriesCanonical : serializeObjectEntries;
    const entries = method(state, object);
    const content = entries.join(",");
    const qson = `(${content})`;
    return qson;
}

function serializeObjectEntries(state:SerializerState, object:Obj) {
    const qsEntries:string[] = [];
    for (const [key, data] of Object.entries(object)) {
        const entry = serializeObjectEntry(state, object, key, data);
        if (entry) qsEntries.push(entry);
    }
    return qsEntries;
}

function serializeObjectEntriesCanonical(state:SerializerState, object:Obj) {
    const entries:string[] = [];
    const keys = Object.keys(object).sort();
    for (const key of keys) {
        const data = object[key];
        const entry = serializeObjectEntry(state, object, key, data);
        if (entry) entries.push(entry);
    }
    return entries;
}

function serializeObjectEntry(state:SerializerState, object:Obj, key:string, data:any,) {
    const qsonKey = encodeKey(key);
    const qsonData = serializeItem(state, object, key, data);
    if (!qsonData) return "";
    const entry = `${qsonKey}:${qsonData}`;
    return entry;
}

function serializeArray(state:SerializerState, array:any[]):string {
    state.pushReference(array);
    const entries:string[] = [];
    for (let index=0; index<array.length; index++) {
        const data = array[index];
        const qsonData = serializeItem(state, array, index, data) || "null";
        entries.push(qsonData);
    }
    const content = entries.join(",");
    const qson = `@(${content})`;
    state.popReference();
    return qson;
}

function serializeString(string:string):string {
    const content = encodeString(string);
    const qson = `$${content}$`;
    return qson;
}
