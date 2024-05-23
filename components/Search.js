import { useEffect, useRef, useState } from "react";
import { supabase } from "../functions/SupabaseClient";
import { useMobile } from "./providers/MobileContext";

async function doQuery(table, query, fields) {
    //or ilike?
    let s = "";
    for (let i = 0; i < fields.length; ++i) {
        s += fields[i] + ".ilike." + query + "*";
        if (i != fields.length - 1) {
            s += ",";
        }
    }
    const { data, error } = await supabase.from(table).select().or(s);
    if (data) {
        return data;
    } else if (error) {
        return [];
    } else {
        console.error("u didnt await correctly");
    }
}
// TODO: implement the USI cache in this area here
export default function Search({ fields, table, name, JSX, onSelect, err }) {
    if (!JSX) {
        throw Error("JSX paramater must be a JSX element");
    }
    if (typeof onSelect !== "function") {
        throw Error("onSelect must be a function that takes a single parameter called data.");
    }
    if (!Array.isArray(fields) || !(typeof table == "string")) {
        throw Error("Search component requires a list and a table to query from");
    }
    const [results, setResults] = useState([]);
    const [query, setQuery] = useState(undefined);
    const { isMobile } = useMobile();
    const [visible, setVisible] = useState(false);

    const ref = useRef();

    useEffect(() => {
        const ask = async () => {
            if (query && query.length) {
                setVisible(true);
                setResults(await doQuery(table, query, fields));
            } else if (query?.length === 0) {
                setVisible(false);
            }
        };
        ask();
    }, [query]);

    const select = (data) => {
        onSelect(data);
        setResults([]); //improve this by changing visibiliity and caching results
        setQuery("");
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                if (visible) {
                    setVisible(false);
                }
            }
        };
        const handleEscapePressed = (event) => {
            if (event.key === "Escape") {
                if (visible) {
                    setVisible(false);
                }
            }
        };
        document.addEventListener("click", handleClickOutside);
        document.addEventListener("keydown", handleEscapePressed);

        return () => {
            document.removeEventListener("click", handleClickOutside);
            document.removeEventListener("keydown", handleEscapePressed);
        };
    }, [visible]);

    return (
        <div className="search" ref={ref}>
            <div className="search-container" style={{ ...(isMobile ? { width: "calc(100% -20px)" } : {}), ...(err ? { marginBottom: "4px" } : { marginBottom: "26px" }) }}>
                <input className={"search-bar" + (err ? " error" : "")} placeholder={`search ${name}...`} value={query} onChange={(e) => setQuery(e.target.value)} style={err ? {} : {}} />
                <img style={{ height: "32px" }} src="/search.png" />
            </div>
            {err ? (
                <span className="error" style={{ fontSize: "20px", fontStyle: "normal", color: "var(    --danger)" }}>
                    Select an opponent
                </span>
            ) : (
                <></>
            )}

            {visible ? (
                <div className="results-container" style={{ width: "calc(100% - 112px)" }}>
                    {results.map((result) => (
                        <JSX r={result} select={select} style={{ maxWidth: "100%", paddingRight: "21px" }} />
                    ))}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
