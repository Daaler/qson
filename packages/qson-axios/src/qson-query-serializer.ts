import { createQueryString, CreateQueryStringOptions, Obj } from "@qson/js";

export default function qsonQuerySerializer(options:CreateQueryStringOptions = {}) {
    const paramSerializer = {
        serialize(params:Obj) {
            const queryString = createQueryString(params, options);
            return queryString;
        },
    };

    return paramSerializer;
}
