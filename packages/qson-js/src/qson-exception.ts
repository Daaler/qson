import State from "./state.ts";
import ParserState from "./parser-state.ts";
import SerializerState from "./serializer-state.ts";

export default class QSONException {
    readonly ErrorType:typeof Error;
    readonly message:string;

    constructor(ErrorType:typeof Error, state:State, message:string) {
        this.ErrorType = ErrorType;
        this.message = message;
    }
}

export class QSONSyntaxException extends QSONException {

    constructor(state:ParserState, message:string) {
        const _message = `${message}\nat ${state.path}:${state.baseMarker}-${state.offset}`;
        super(SyntaxError, state, _message);
    }
}

export class QSONTypeException extends QSONException {

    constructor(state:SerializerState, message:string) {
        const _message = `${message}\nat ${state.path}`;
        super(TypeError, state, _message);
    }
}

export function handleQSONException(exception:any, constructorOpt:any):never {
    if (!(exception instanceof QSONException)) throw exception;
    const error = new exception.ErrorType(exception.message);
    Error.captureStackTrace(error, constructorOpt);
    throw error;
}
