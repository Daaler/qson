# QSON - Query String Object Notation

Example:

```js
import { createQueryString,parseQueryString } from "qson";

const qs = createQueryString({ search:{ name:"qson",rating:5,public:true },slice:[ 1,10 ] });
// -> "search=(name:$qson$,public:true,rating:5)&slice=@(1,10)"
const search = parseQueryString(qs);
// -> { search:{ name:"qson",public:true,rating:5 },slice:[ 1,10 ]}
```

## What is QSON

A JSON-like notation that can safely be used to store and transport JSON compatible data in URL query strings. It maintains decent human readability while being compatible with WHATWG standard and most tools and systems that handle query strings. By default, produced QSON strings and query strings are canonical for efficient usage as cache keys.

### Capabilities:

- Deterministic. Many systems use guesswork to determine data types when parsing query strings. "If it looks like a number, it must be a number" and "if it doesn't match any specific type, it must be a string". QSON has JSON-style deterministic serializing and parsing.
- Somewhat human readable. JSON can be transferred as base64 encoded but this completely loses human readability unless it is decoded first. From QSON you can easily read data structure, numbers, booleans and null. Strings and object keys are percent-encoded so they maintain some human-readability unless they contain mostly characters that must be percent encoded e.g. characters completely outside ASCII plane.
- JSON API compatible. Anything that can be serialized to JSON and parsed back should also be able to be serialized to QSON and parsed back. QSON supports \<object>.toJSON methods and replacer and reviver functions just like JSON.

This package contains methods for creating and parsing QSON strings and helpers for creating and parsing complete query strings where values are QSON.

## What QSON is not

Not a JSON replacement. JSON is still faster, more human-readable and also human-writable.

Not 100% compatible with all other tools and systems. If a QSON or QSON-containing query string is passed through percent decoder, the QSON structure can become corrupted.

## API

ESM:
```js
import { stringifyQSON,parseQSON,createQueryString,parseQueryString } from "qson";
```

TypeScript:
```ts
import type { SerializerOptions,ParserOptions } from "qson";
```

CJS:
```js
const { stringifyQSON,parseQSON,createQueryString,parseQueryString } = require("qson");
```

### Core:

`stringifyQSON(data[,options])`
- data\<object|array|string|boolean|null>
- options\<SerializerOptions>
	- replacer\<function> a json api style replacer function
	- canonical\<boolean> (default: true) sort object keys
	- maxDepth\<number> (default: 10) Maximum nesting depth. Error is thrown if exceeded.
* returns\<string>

Takes in any valid QSON (JSON) compatible data. Returns a QSON string representing the data.

`parseQSON(text[,options])`
- text\<string> QSON string
- options\<ParserOptions>
	- reviver\<function> a json api style reviver function
	- maxDepth\<number> (default: 10) Maximum nesting depth. Error is thrown if exceeded.
* returns\<object|array|string|boolean|null>

Takes in any valid QSON string. Returns corresponding JS data.

### Helpers:

`createQueryString(data[,options])`
- data\<object>
- options\<SerializerOptions>
	- replacer\<function> a json api style replacer function
	- canonical\<boolean> (default: true) sort object keys
	- maxDepth\<number> (default: 10) Maximum nesting depth. Error is thrown if exceeded.
* returns\<string>

Takes in an object where keys are query string keys and values are any QSON (JSON) compatible data. Returns query string (without leading '?') where values are QSON encoded. Replacer function is run on each entry in data (query object) but not for the query object itself.

`parseQueryString(text[,options])`
- text\<string> query string where values are QSON encoded
- options\<ParserOptions>
	- reviver\<function> a json api style reviver function
	- maxDepth\<number> (default: 10) Maximum nesting depth. Error is thrown if exceeded.
* returns\<object>

Takes in a query string (without leading '?') where values are QSON encoded. Returns an object where keys are query string keys and values are JS data. Reviver function is run on each entry in the resulting query object but not for the query object itself.

### Types:

Package includes TypeScript types.
