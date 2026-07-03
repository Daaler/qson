import { parseQueryString, ParseQueryStringOptions } from "@qson/js";

export default function qsonQueryParser(options:ParseQueryStringOptions = {}) {

    function queryParser(rawQuery:string):Obj {
        const query = parseQueryString(rawQuery, options);
        return query;
    }

    return queryParser;
}

type Obj = { [key:string]:any };
