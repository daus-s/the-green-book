function allButThis(list, element) {
    if (typeof element === "bigint") {
        throw Error('not yet implemented');
    }
    if (typeof element === "boolean") {
        throw Error('not yet implemented');
    }
    if (typeof element === "function") {
        throw Error('not yet implemented');
    }
    if (typeof element === "number") {
        return list.filter(item=>element!==item);
    }
    if (typeof element === "object") {
        return list.filter(item=>JSON.stringify(item)!==JSON.stringify(element));
    }
    if (typeof element === "string") {
        throw Error('not yet implemented');
    }
    if (typeof element === "symbol") {
        throw Error('not yet implemented');
    }
    if (typeof element === "undefined") {
        return list;
    }
    return list;
}

function allButThese(list, elements) {
    if (!Array.isArray(list) || !Array.isArray(elements)) {
        throw Error('allButThese requires two lists');
    }
    else {
        if (elements.length) {
            return allButThese(allButThis(list,  elements.pop()), elements)
        } else {
            return list;
        }
    }
}

module.exports = { allButThis, allButThese }