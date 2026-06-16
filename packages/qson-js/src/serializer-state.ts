import { QSONTypeException } from "./qson-exception.ts";
import State, { Options as StateOptions } from "./state.ts";

export default class SerializerState extends State {
    private readonly _canonical:boolean;
    private readonly _references:Reference[];

    get canonical() { return this._canonical; }

    constructor(options:Options) {
        const { canonical } = options;
        super(options);
        this._canonical = canonical;
        this._references = [];
    }

    pushReference(reference:Reference) {
        if (this._references.includes(reference)) throw new QSONTypeException(this, "Converting circular structure to QSON");
        this._references.push(reference);
    }

    popReference() {
        this._references.pop();
    }
}

export interface Options extends StateOptions {
	canonical:boolean;
}

type Reference = Object|Array<any>;
