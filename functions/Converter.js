function toString(data) {
    switch (typeof data) {
        case "string":
            return data;
        case "number":
            return data;
        case "bigint":
            return data;
        case "boolean":
            return data?"True":"False"
        case "undefined":
            return "";
        case "object":
            return JSON.stringify(data);
        default:
            return String(data);
    }
}

module.exports = {toString}