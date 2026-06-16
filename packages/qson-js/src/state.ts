import { Key, Transform } from "./types.ts";

export default class State {
    private readonly _path:Key[];
    private readonly _transform:Transform;
    private readonly _hasTransform:boolean;

    get hasTransform() { return this._hasTransform; }

    get path() {
        return this._path.join(".");
    }

    constructor(options:Options) {
        const { transform } = options;
        this._transform = transform || noTransform;
        this._hasTransform = !!transform;
        this._path = [];
    }

    enter(path:Key) {
        this._path.push(path);
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
	transform?:Transform
}
