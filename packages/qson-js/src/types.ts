export type Key = string|number;
export type Obj = { [key:string]:any };
export type Transform = (this:any, key:Key, item:any)=>any;
export type IsQSON = (key:string)=>boolean;
