import State, { Options } from "./state.ts";

export default class ParserState extends State {
    private readonly _qson:string;
    private _baseMarker:number;
    private _offset:number;
    private _current:string;

    get baseMarker() { return this._baseMarker; }
    get offset() { return this._offset; }
    get look() { return this._current; }

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
        if (this._offset > this._qson.length) throw new Error("Unexpected end of QSON input");
        this._offset += n;
        this._current = this._qson[this._offset] || "";
    }

    mark() {
        this._baseMarker = this._offset;
    }
}
