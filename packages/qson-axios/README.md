# QSON query serializer for [axios](https://www.npmjs.com/package/axios)

See [@qson/js](https://www.npmjs.com/package/@qson/js) for what QSON is.

Other packages in the QSON ecosystem:

- [@qson/express](https://www.npmjs.com/package/@qson/express) - Express.js integration
- [@qson/react](https://www.npmjs.com/package/@qson/react) - React utilities

Example:

```js
import axios from "axios";
import { qsonQuerySerializer } from "@qson/axios";

const apiClient = axios.create({
	baseURL: "/api",
	paramsSerializer: qsonQuerySerializer({ isQSON: (key) => key !== "_id" }),
});
```

## API

`qsonQuerySerializer([options])`
- options\<CreateQueryStringOptions>

`CreateQueryStringOptions`
- isQSON\<`(key:string) => boolean`> A callback that gets key as an argument and returns boolean. True for QSON fields. False for raw string fields. This applies only to query (root) object fields. (default: all fields are considered QSON)
- replacer\<function> A json api style replacer function. It is run for each QSON field in query (root) object but not for the query object itself.
- canonical\<boolean> Sort object and query string keys. (default: true)
- maxDepth\<number> Maximum nesting depth. Error is thrown if exceeded. (default: 10)
