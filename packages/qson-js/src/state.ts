import QSONException from "./qson-exception.ts";
import { Key, Transform } from "./types.ts";

export default class State {
    private readonly _path:Key[];
    private readonly _transform:Transform;
    private readonly _hasTransform:boolean;
    private readonly _maxDepth:number;

    get hasTransform() {
        return this._hasTransform;
    }

    get path() {
        return this._path.join(".");
    }

    constructor(options:Options) {
        const { transform, maxDepth = 10 } = options;
        this._transform = transform || noTransform;
        this._hasTransform = !!transform;
        this._maxDepth = maxDepth;
        this._path = [];
    }

    enter(path:Key) {
        this._path.push(path);
        if (this._path.length > this._maxDepth) throw new QSONException(Error, this, `Max nesting depth (${this._maxDepth}) exceeded`);
    }

    leave() {
        this._path.pop();
    }

    transform(origin:any, key:Key, value:any) {
        return this._transform.call(origin, key, value);
    }
}

function noTransform(key:Key, item:any):any {
    throw new Error("Transform function was not provided");
}

export interface Options {
    transform?:Transform|null;
    maxDepth?:number;
}
