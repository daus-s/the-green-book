function allButThis(list, element) {
    if (typeof element === "bigint") {
        throw Error("not yet implemented");
    }
    if (typeof element === "boolean") {
        throw Error("not yet implemented");
    }
    if (typeof element === "function") {
        throw Error("not yet implemented");
    }
    if (typeof element === "number") {
        return list.filter((item) => element !== item);
    }
    if (typeof element === "object") {
        return list.filter((item) => !jsql(item, element));
    }
    if (typeof element === "string") {
        throw Error("not yet implemented");
    }
    if (typeof element === "symbol") {
        throw Error("not yet implemented");
    }
    if (typeof element === "undefined") {
        return list;
    }
    return list;
}

function allButThese(list, elements) {
    if (!Array.isArray(list) || !Array.isArray(elements)) {
        throw Error("allButThese requires two lists");
    } else {
        if (elements.length) {
            return allButThese(allButThis(list, elements.pop()), elements);
        } else {
            return list;
        }
    }
}

function has(list, element) {
    for (const item of list) {
        if (typeof element === "bigint" || typeof element === "boolean" || typeof element === "number" || typeof element === "string") {
            if (element === item) {
                return true;
            }
        }
        if (typeof element === "object") {
            if (isEqual(item, element)) {
                return true;
            }
        }
        if (typeof element === "symbol" || typeof element === "function") {
            throw Error("not yet implemented");
        }
        if (typeof element === "undefined") {
            return true;
        }
    }
    return false;
}

function splitnSort(l, e) {
    const a = [];
    const b = [];
    for (const c of l) {
        if (c[e]) {
            a.push(c);
        } else {
            b.push(c);
        }
    }
    const d = a.concat(b);
    return d;
}

function partialEqual(json1, json2, fieldName) {
    const deep1 = { ...json1 };
    const deep2 = { ...json2 };
    if (deep1.hasOwnProperty(fieldName)) {
        delete deep1[fieldName];
    }
    if (deep2.hasOwnProperty(fieldName)) {
        delete deep2[fieldName];
    }
    return jsql(deep1, deep2);
}
/**
 *
 * Example Usage:
 *
 *  function isOption(option) {
 *    const optionSchema = {
 *      bid: "number",
 *      oid: "number",
 *      winner: "boolean",
 *      content: "string",
 *     };
 *
 *   return isLike(option, optionSchema);
 * }
 *
 *
 * @param {*} obj
 * @param {*} kvps
 * @returns
 */
function isLike(obj, kvps) {
    if (typeof obj !== "object" || typeof kvps !== "object") {
        throw new Error(
            "isLike can only compare objects: " +
                (typeof obj === "object"
                    ? typeof kvps === "object"
                        ? "\nHow is this thrown?\n"
                        : "\n  • kvps [ERROR]\n"
                    : typeof kvps === "object"
                    ? "\n  • obj [ERROR]\n"
                    : "  • kvps [ERROR]\n  • kvps [ERROR]\n")
        );
    }
    const types = ["number", "string", "boolean", "undefined", "object", "function", "symbol", "bigint"];

    for (const [key, expectedType] of Object.entries(kvps)) {
        if (!types.includes(expectedType)) {
            /*
             * we throw here because isLike cannot control the input object were comparing to this maybe used to validate user input,
             * but what we should only allow certain type comparisons
             */
            throw new Error(`Invalid type "${expectedType}" for key "${key}"`);
        }

        console.log({ key, obj });
        if (!(key in obj)) {
            return false;
        }

        if (typeof obj[key] !== expectedType) {
            return false;
        }
    }

    return true;
}

/*json equal*/
function jsql(a, b) {
    const aCopy = { ...a };
    const bCopy = { ...b };

    const aEntries = Object.entries(aCopy);

    for (const [aKey, aVal] of aEntries) {
        if (bCopy.hasOwnProperty(aKey) && bCopy[aKey] === aVal) {
            delete aCopy[aKey];
            delete bCopy[aKey];
        }
    }

    return Object.keys(aCopy).length + Object.keys(bCopy).length === 0;
}

module.exports = {
    allButThis,
    allButThese,
    has,
    splitnSort,
    partialEqual,
    isLike,
    jsql,
};
