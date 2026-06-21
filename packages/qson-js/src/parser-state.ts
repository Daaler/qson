import { QSONSyntaxException } from "./qson-exception.ts";
import State, { Options } from "./state.ts";

export default class ParserState extends State {
    private readonly _qson:string;
    private _baseMarker:number;
    private _offset:number;
    private _current:string;

    get baseMarker() {
        return this._baseMarker;
    }
    get offset() {
        return this._offset;
    }
    get peek() {
        return this._current;
    }
    get look() {
        if (!this._current) throw new QSONSyntaxException(this, "Unexpected end of QSON input");
        return this._current;
    }

    constructor(qson:string, options:Options) {
        super(options);
        this._qson = qson.trim();
        this._baseMarker = 0;
        this._offset = 0;
        this._current = this._qson[0] || "";
    }

    slice(start:number, end:number) {
        return this._qson.slice(start, end);
    }

    advance(n:number=1) {
        this._offset += n;
        this._current = this._qson[this._offset] || "";
        if (this._offset > this._qson.length) throw new Error("Trying move past QSON text end");
    }

    mark() {
        this._baseMarker = this._offset;
    }

    move(n:number=1) {
        this._offset += n;
        this._current = this._qson[this._offset] || "";
        if (this._offset > this._qson.length) throw new Error("Trying move past QSON text end");
        this._baseMarker = this._offset;
    }

    match(regex:RegExp) {
        regex.lastIndex = this._baseMarker;
        const match = regex.exec(this._qson)?.[0] || "";
        this._offset += match.length;
        this._current = this._qson[this._offset] || "";
        return match;
    }
}
