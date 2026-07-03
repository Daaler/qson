import { createQueryString, CreateQueryStringOptions } from "@qson/js";

export default function qsonQuerySerializer(options:CreateQueryStringOptions = {}) {
    const paramSerializer = {
        serialize(params:Record<string, any>) {
            const queryString = createQueryString(params, options);
            return queryString;
        },
    };

    return paramSerializer;
}
