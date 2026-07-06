import React, { useCallback, useMemo } from "react";
import {
    useLocation as useReactLocation,
    useNavigate as useReactNavigate,
    Link as ReactLink,
} from "react-router";
import { createQueryString, CreateQueryStringOptions, parseQueryString } from "@qson/js";
import { Location,LinkProps,Path,NavigateOptions,Obj } from "./types.ts";

export default function createNavigationUtils(_options:CreateQueryStringOptions = {}) {
    const Link = React.forwardRef<HTMLAnchorElement,LinkProps>(
        function QSONLink(props, ref) {
            const { to, query, ...rest } = props;
            const _to = useMemo(
                () => parseTo(to, { query }),
                [to, query],
            );

            return <ReactLink ref={ref} to={_to} {...rest} />;
        },
    );

    function useNavigate() {
        const reactNavigate = useReactNavigate();

        const navigate = useCallback(
            function navigate(to:string|number|Path, options?:NavigateOptions) {
                if (typeof to === "number") return reactNavigate(to);
                const _to = parseTo(to, options);
                return reactNavigate(_to, options);
            },
            [reactNavigate],
        );

        return navigate;
    }

    function useLocation() {
        const reactLocation = useReactLocation();
        const location = useMemo(
            () => {
                const search = reactLocation.search ? reactLocation.search.slice(1) : "";
                const query = getQueryObject(search);
                const location:Location = { ...reactLocation, query };
                return location;
            },
            [reactLocation],
        );
        return location;
    };

    let queryCacheKey = "";
    let queryCache:Obj = {};

    function getQueryObject(search:string) {
        if (queryCacheKey === search) return queryCache;

        queryCacheKey = search;
        queryCache = parseQueryString(search, _options);
        
        return queryCache;
    }

    function parseTo(to:string|Path, options?:NavigateOptions) {
        const _to:Path = {};
        
        if (typeof to === "string") {
            _to.pathname = to;
        } else {
            Object.assign(_to, to);
            if (to.query) {
                const queryString = createQueryString(to.query, _options);
                _to.search = `?${queryString}`;
            }
        }

        if (options?.query) {
            const queryString = createQueryString(options.query, _options);
            _to.search = `?${queryString}`;
        }

        if (options?.hash) _to.hash = options.hash;

        return _to;
    }

    return { useLocation, useNavigate, Link };
}
