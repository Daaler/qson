import ParserState from "./parser-state.ts";
import { Options } from "./state.ts";
import { Key } from "./types.ts";
import { QSONSyntaxException } from "./qson-exception.ts";
import { Obj } from "./types.ts";

export default function parse(qson:string, options:Options, key:string=""):any {
    const state = new ParserState(qson, options);
    state.enter(key || "(root)");
    let item = _parseItem(state);
    if (state.peek) throw new QSONSyntaxException(state, "Expected QSON string to end but it contains extra characters");
    if (state.hasTransform) item = state.transform({ key: item }, key, item);
    state.leave();
    return item;
}

function parseItem(state:ParserState, key:Key):any {
    state.enter(key);
    const item = _parseItem(state);
    state.leave();
    return item;
};

function _parseItem(state:ParserState):any {
    const char = state.look;
    switch (char) {
    case "(": return parseObject(state);
    case "@": return parseArray(state);
    case "$": return parseString(state);
    case "n": return parseNull(state);
    case "t": return parseTrue(state);
    case "f": return parseFalse(state);
    }
    if (/[0-9\-]/.test(char)) return parseNumber(state);
    throw new QSONSyntaxException(state, "Expected '(', '@', '$', 'null', 'true', 'false', or number (0-9 or '-')");
}

function parseObject(state:ParserState):Obj {
    state.move(); // pass "("
    const object:Obj = {};
    if (state.look === ")") {
        state.move();
        return object;
    }
    while (true) {
        const key = parseKey(state);
        const item = parseItem(state, key);
        object[key] = item;
        const delimiter:string = state.look;
        if (delimiter === ")") break;
        if (delimiter !== ",") throw new QSONSyntaxException(state, "Expected ',' or ')' after property value in QSON");
        state.move();
    }
    state.advance(); // pass ")"
    if (state.hasTransform) transformObject(state, object);
    state.mark();
    return object;
}

function parseKey(state:ParserState):string {
    const encoded = state.match(/[a-zA-Z0-9\-_!*.~@;$%]*/y);
    const decoded = decodeURIComponent(encoded);
    if (state.peek !== ":") throw new QSONSyntaxException(state, `"Expectedr ':' to delimit QSON object key" ${state.peek}`);
    state.move();
    return decoded;
}

function transformObject(state:ParserState, object:Obj) {
    for (const [key, value] of Object.entries(object)) {
        object[key] = state.transform(object, key, value);
    }
}

function parseArray(state:ParserState):any[] {
    state.advance(); // pass "@"
    if (state.look !== "(") throw new QSONSyntaxException(state, "Expected '(' after array marker '@' in QSON");
    state.move();
    const array:any[] = [];
    if (state.look as string === ")") {
        state.move();
        return array;
    }
    for (let index=0; true; index++) {
        const item = parseItem(state, index);
        array.push(item);
        const delimiter:string = state.look;
        if (delimiter === ")") break;
        if (delimiter !== ",") throw new QSONSyntaxException(state, "Expected: ',' or ')' after array element in QSON");
        state.move(); // pass ","
    }
    state.advance(); // pass ")"
    if (state.hasTransform) transformArray(state, array);
    state.mark();
    return array;
}

function transformArray(state:ParserState, array:any[]) {
    for (let index in array) {
        const value = array[index];
        array[index] = state.transform(array, index, value);
    }
}

function parseString(state:ParserState):string {
    state.advance(); // pass "$"
    const start = state.offset;
    while (state.look !== "$") state.advance();
    const end = state.offset;
    state.advance(); // pass "$"
    const encoded = state.slice(start, end);
    const decoded = decodeURIComponent(encoded);
    state.mark();
    return decoded;
}

function parseNull(state:ParserState):null {
    checkPrimitiveSyntax(state, "null");
    return null;
}

function parseTrue(state:ParserState):true {
    checkPrimitiveSyntax(state, "true");
    return true;
}

function parseFalse(state:ParserState):false {
    checkPrimitiveSyntax(state, "false");
    return false;
}

function checkPrimitiveSyntax(state:ParserState, regex:string):void {
    const match = state.matchString(regex);
    const next = state.peek;
    if (!match || (next !== "," && next !== ")" && next !== ""))
        throw new QSONSyntaxException(state, "Expected '(', '@', '$', 'null', 'true', 'false', or number (0-9 or '-')");
    state.mark();
}

function parseNumber(state:ParserState):number {
    const numberSyntax = state.match(/-?[0-9]+(?:\.[0-9]+)?(e-?[0-9]+)?/y);
    const number = Number(numberSyntax);
    if (!Number.isFinite(number) || !numberSyntax) throw new QSONSyntaxException(state, `Invalid number: ${numberSyntax}. Result: ${number}`);
    state.mark();
    return number;
}
