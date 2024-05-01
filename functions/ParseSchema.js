const { has } = require("./AllButThisJSON");

const _tournaments =  ["masters", "pgachamps", "usopen", "theopen"];
/**
 * 
 * @param {string} string 
 * @returns {boolean}
 */
function parseable(string) {
    if (typeof string === "undefined") {
        return false;
    } 
    else if (typeof string !== "string") {
        return false;
    }
    const parts = string.split('_')
    if (parts.length!==3) {
        return false;
    }
    let year = parseInt(parts[0]);
    let rank = parseInt(parts[1]);

    const a = typeof year === "number" && !isNaN(year) && year > 2022; 
    const b = typeof rank === "number" && !isNaN(rank); 
    const c = parts[2] in _tournaments;
    return a && b && c
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
    const parts = string.split('_');
    return {
        year: parts[0],
        index: parts[1],
        tournament: parts[2]
    }
}

function validateFields(object) {   
    if (typeof object !== 'object') {
        return false;
    }
    if (Object.keys(object).length===0) {
        return false;
    }
    console.log(object)
    if (object?.year&&object?.tournament) {
        // console.log('tournament ∈ T is', has( _tournaments, object.tournament));
        if (parseInt(object.year)&&object.year>=2023&&has( _tournaments, object.tournament)) {
            return true;
        }
    }
    return false;
}

module.exports = { parseable, seperated, validateFields}