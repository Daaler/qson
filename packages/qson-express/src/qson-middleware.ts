import { Request, Response } from "express";
import { Obj, parseQueryString, ParseQueryStringOptions } from "@qson/js";

export default function qsonMiddleware(options:ParseQueryStringOptions = {}) {

    function middleware(request:Request, response:Response, next:any) {
        try {
            request.qson = {};
            const questionMarkIndex = request.originalUrl.indexOf("?");
            if (questionMarkIndex === -1) {
                next();
                return;
            }
            const rawQuery = request.originalUrl.slice(questionMarkIndex + 1);
            request.qson = parseQueryString(rawQuery, options);
            next();
        } catch (error:any) {
            next(error);
        }
    }

    return middleware;
}

declare global {
    namespace Express {
        interface Request {
            qson?: Obj;
        }
    }
}
