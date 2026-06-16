import { stringEncodingTable, keyEncodingTable, qsKeyEncodingTable } from "./encoding-tables.ts";

export function encodeString(string:string) {
    if (!/[^a-zA-Z0-9()\-_!*,.~@;:]/.test(string)) return string;
    const state = new StringEncoderState(string);
    const qsonString = encodeText(state);
    return qsonString;
}

export function encodeKey(key:string) {
    if (!/[^a-zA-Z0-9()\-_!*,.~@;$]/.test(key)) return key;
    const state = new KeyEncoderState(key);
    const qsonKey = encodeText(state);
    return qsonKey;
}

export function encodeQsKey(key:string) {
    if (!/[^a-zA-Z0-9()\-_!*,.~@;:$]/.test(key)) return key;
    const state = new QsKeyEncoderState(key);
    const qsonKey = encodeText(state);
    return qsonKey;
}

function encodeText(state:EncoderState) {
    state.init();
    while (true) {
        switch (state.charType) {
        case ASCII:
            passAllowedAscii(state);
            break;
        case ESCAPE:
            escapeAscii(state);
            break;
        case UNICODE:
            encodeUnicode(state);
            break;
        case EOF:
            const encoded = state.parts.join("");
            return encoded;
        }
    }
}

function passAllowedAscii(state:EncoderState) {
    const m = state.n;
    state.move();
    while (state.charType === 1) state.move();
    const passed = state.string.slice(m, state.n);
    state.parts.push(passed);
}

function escapeAscii(state:EncoderState) {
    const escaped = state.encodingTable[state.charCode];
    state.parts.push(escaped);
    state.move();
}

function encodeUnicode(state:EncoderState) {
    const slice = state.string.slice(state.n);
    const bytes = textEncoder.encode(slice);
    for (let i=0; i<bytes.length; i++) {
        const byte = bytes[i];
        const replacement = state.encodingTable[byte];
        state.parts.push(replacement);
    }
    state.finalize();
}

abstract class EncoderState {
	abstract readonly encodingTable:string[];
	readonly string:string;
	n:number;
	charCode:number;
	charType:CharType;
	readonly parts:string[];

	constructor(string:string) {
	    this.string = string;
	    this.n = 0;
	    this.charCode = string.charCodeAt(0);
	    this.charType = EOF;
	    this.parts = [];
	}

	init() {
	    this._defineCharType();
	}

	move() {
	    this.n++;
	    this.charCode = this.string.charCodeAt(this.n);
	    this._defineCharType();
	}

	finalize() {
	    this.charType = EOF;
	}

	private _defineCharType() {
	    this.charType = (
	        Number.isNaN(this.charCode) ? EOF :
	            this.charCode >= 128 ? UNICODE :
	                this.encodingTable[this.charCode].length === 1 ? ASCII :
	                    ESCAPE
	    );
	}
}

class StringEncoderState extends EncoderState {
    encodingTable = stringEncodingTable;
}

class KeyEncoderState extends EncoderState {
    encodingTable = keyEncodingTable;
}

class QsKeyEncoderState extends EncoderState {
    encodingTable = qsKeyEncodingTable;
}

const textEncoder = new TextEncoder();

type ASCII = 1;
const ASCII:ASCII = 1;
type ESCAPE = 2;
const ESCAPE:ESCAPE = 2;
type UNICODE = 3;
const UNICODE:UNICODE = 3;
type EOF = 4;
const EOF:EOF = 4;

type CharType = ASCII|ESCAPE|UNICODE|EOF;
