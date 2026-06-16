import ParserState from "./parser-state.ts";
import { Options } from "./state.ts";
import { Key } from "./types.ts";
import { QSONSyntaxException } from "./qson-exception.ts";
import { Obj } from "./types.ts";

export default function parse(qson:string, options:Options, key:string=""):any {
    const state = new ParserState(qson, options);
    state.enter(key || "(root)");
    let item = _parseItem(state);
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
    state.advance(); // pass "("
    const object:Obj = {};
    if (state.look === ")") {
        state.advance();
        return object;
    }
    while (true) {
        const key = parseKey(state);
        state.advance(); // pass ":"
        const item = parseItem(state, key);
        object[key] = item;
        const delimiter:string = state.look;
        if (delimiter === ")") break;
        if (delimiter !== ",") throw new QSONSyntaxException(state, "Expected ',' or ')' after property value in QSON");
        state.advance(); // pass ","
    }
    state.advance(); // pass ")"
    if (state.hasTransform) transformObject(state, object);
    state.mark();
    return object;
}

function transformObject(state:ParserState, object:Obj) {
    for (const [key, value] of Object.entries(object)) {
        object[key] = state.transform(object, key, value);
    }
}

function parseArray(state:ParserState):any[] {
    state.advance(); // pass "@"
    if (state.look !== "(") throw new QSONSyntaxException(state, "Expected '(' after array marker '@' in QSON");
    state.advance();
    const array:any[] = [];
    if (state.look as string === ")") {
        state.advance();
        return array;
    }
    for (let index=0; true; index++) {
        const item = parseItem(state, index);
        array.push(item);
        const delimiter:string = state.look;
        if (delimiter === ")") break;
        if (delimiter !== ",") throw new QSONSyntaxException(state, "Expected: ',' or ')' after array element in QSON");
        state.advance(); // pass ","
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

function parseKey(state:ParserState):string {
    const start = state.offset;
    while (state.look !== ":") state.advance();
    const end = state.offset;
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

function checkPrimitiveSyntax(state:ParserState, primitiveName:string):void {
    const start = state.offset;
    state.advance(primitiveName.length);
    const end = state.offset;
    const check = state.slice(start, end);
    if (check !== primitiveName) throw new Error("Invalid value in QSON");
    state.mark();
}

function parseNumber(state:ParserState):number {
    const start = state.offset;
    state.advance() // first char assumed legit number syntax
    while (/[0-9]/.test(state.look)) state.advance();
    if (state.look === ".") {
        state.advance();
        while (/[0-9]/.test(state.look)) state.advance();
    }
    if (state.look === "e") {
        state.advance();
        if (!/[0-9\-]/.test(state.look)) throw new QSONSyntaxException(state, "Expected digit (0-9) or dash (-) after 'e'");
        state.advance();
        while (/[0-9]/.test(state.look)) state.advance();
    }
    const end = state.offset;
    const numberSyntax = state.slice(start, end);
    const number = Number(numberSyntax);
    if (!Number.isFinite(number)) throw new QSONSyntaxException(state, `Invalid number: ${numberSyntax}. Result: ${number}`);
    state.mark();
    return number;
}
