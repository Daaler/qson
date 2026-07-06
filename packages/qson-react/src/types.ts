import {
    LinkProps as ReactLinkProps,
    Location as ReactLocation,
    NavigateOptions as ReactNavigateOptions,
} from "react-router";

export interface Location<State=any> extends ReactLocation<State> {
    query:Obj;
}

export interface LinkProps extends ReactLinkProps {
    to:string|Path;
    query?:Obj;
}

export interface Path {
    pathname?:string;
    query?:Obj;
    search?:string;
    hash?:string;
}

export interface NavigateOptions extends ReactNavigateOptions {
    query?:Obj;
    hash?:string;
}

export type Obj = { [key:string]:any };
