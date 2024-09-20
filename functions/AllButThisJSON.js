import isEqual from "lodash/isEqual";

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
        return list.filter((item) => !isEqual(item, element));
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
    return isEqual(deep1, deep2);
}

function isLike(obj, kvps) {
    const types = ["number", "string", "boolean", "undefined", "object", "function", "symbol", "bigint"];

    for (const [key, expectedType] of Object.entries(kvps)) {
        if (!types.includes(expectedType)) {
            throw new Error(`Invalid type "${expectedType}" for key "${key}"`);
        }

        if (!(key in obj)) {
            return false;
        }

        if (typeof obj[key] !== expectedType) {
            return false;
        }
    }

    return true;
}

module.exports = { allButThis, allButThese, has, splitnSort, partialEqual, isLike };
