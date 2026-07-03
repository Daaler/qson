# QSON query string parser and middleware for Express.js

See [@qson/js](https://www.npmjs.com/package/@qson/js) for what QSON is.

Use either of the following that fits your project.

Example:

```js
import express from "express";
import { qsonQueryParser } from "@qson/express";

const app = express();
// Replace default query string parser (result is available in request.query)
// Parse query string keys starting with "q_" as QSON and others as raw strings (this setting is optional)
app.set("query parser", qsonQueryParser({ isQSON: (key) => key.startsWith("q_") }));
```

or:

```js
import express from "express";
import { qsonMiddleware } from "@qson/express";

const app = express();
// Parse query string and make the result available in request.qson (request.query is untouched)
// Keys "_id" is parsed as raw string and others are parsed as QSON
app.use(qsonMiddleware({ isQSON: (key) => key !== "_id" }));
```

## API

`qsonQueryParser([options])`
- options\<ParseQueryStringOptions>

`qsonMiddleware([options])`
- options\<ParseQueryStringOptions>

`ParseQueryStringOptions`
- isQSON\<`(key:string) => boolean`> a callback that gets key as an argument and returns boolean. True for QSON fields. False for raw string fields. This applies only to query (root level) fields. (default: all fields are considered QSON)
- reviver\<function> A json api style reviver function. It is run for each QSON field in query (root) object but not for the query object itself.
- maxDepth\<number> Maximum nesting depth. Error is thrown if exceeded. (default: 10)
