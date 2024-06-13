const { has } = require("./AllButThisJSON");

const _tournaments = ["masters", "pgachamps", "usopen", "theopen"];
/**
 *
 * @param {string} string
 * @returns {boolean}
 */
function parseable(string) {
    if (typeof string === "undefined") {
        return false;
    } else if (typeof string !== "string") {
        return false;
    }
    const parts = string.split("_");
    if (parts.length !== 3) {
        return false;
    }
    let year = parseInt(parts[0]);
    let rank = parseInt(parts[1]);

    const a = typeof year === "number" && !isNaN(year) && year > 2022;
    const b = typeof rank === "number" && !isNaN(rank);
    const c = parts[2] in _tournaments;
    return a && b && c;
}
/**
 *
 * @param {string} string
 * @returns {object}
 */
function seperated(string) {
    //i may be overengineering the fuck out of this
    if (!parseable(string)) {
        return undefined;
    }
    const parts = string.split("_");
    return {
        year: parts[0],
        index: parts[1],
        tournament: parts[2],
    };
}

function validateFields(object) {
    if (typeof object !== "object") {
        return 0;
    }
    if (Object.keys(object).length === 0) {
        return 2;
    }
    if (object?.year && object?.tournament) {
        // console.log('tournament ∈ T is', has( _tournaments, object.tournament));
        if (parseInt(object.year) && parseInt(object.year) >= 2023 && has(_tournaments, object.tournament)) {
            return 1;
        }
    }
    return 0;
}

function validateUrlext(str) {
    switch (str) {
        case "masters-2024":
            return true;
        case "masters-2023":
            return true;
        case "pga-championship-2024":
            return true;
        case "open-us-2024":
            return true;
        default:
            return false;
    }
}

function getTid(fullname) {
    const titles = ["masters", "pgachamps", "usopen", "theopen"];
    switch (fullname) {
        case "Masters":
            return titles[0];
        case "PGA Championship":
            return titles[1];
        case "US Open":
            return titles[2];
        case "The Open":
            return titles[3];
        default:
            throw Error("not a real tournament");
    }
}

module.exports = { parseable, seperated, validateFields, validateUrlext, getTid };
