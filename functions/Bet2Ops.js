//functions and operatoprs for the Bet2 DataStructure

const { imp2american } = require("./CalculateProbabilities");

/* SCHEMA
 * ___________________________________________________________________________________________________________
 * | id PK, unq | content  | creator FK -> public_users.id | public | open | g FK -> groups.groupID | line   |
 * | int8, seq  | text     | int4                          | bool   | bool | int4                   | float4 | = 22+strlen(context)
 * -----------------------------------------------------------------------------------------------------------   SIZE
 */

function validate(bet) {
    //type assertion
    const { id, content, creator, public: pub, open, g: group, line } = bet;
    const type =
        bet &&
        (typeof id === "bigint" || typeof id === "number") &&
        typeof content === "string" &&
        typeof creator === "number" &&
        typeof open === "boolean" &&
        typeof pub === "boolean" &&
        (typeof group === "number" || group === null) &&
        (typeof line === "number" || line === null);
    if (!type) {
        return false;
    }

    // if a group isn't specified then the bet must be public
    // if not then the bet is not valid
    if (group === null && !pub) {
        return false;
    }

    return true;
}

function mode(bet) {
    if (!validate(bet)) {
        return null;
    }
    const { line } = bet;

    if (line) {
        return "over_under";
    } else if (line === "null") {
        return "options";
    }
}

function percentForOpt(oid, wagers) {
    let total = 0;
    let optsel = 0;
    for (const wager of wagers) {
        if (wager.oid === oid) {
            optsel += wager.amount;
        }
        total += wager.amount;
    }
    if (!total) {
        return NaN;
    }
    return optsel / total;
}

function sfo(options, wagers) {
    const kvps = [];
    for (const option of options) {
        const kvp = {
            option: option,
        };
        const val = [];
        let sum = 0;
        for (const wager of wagers) {
            if (option.oid === wager.oid) {
                val.push(wager);
                sum += wager.amount;
            }
        }
        kvp.wagers = val;
        //a little meta data
        kvp.sum = sum;
        kvps.push(kvp);
    }
    return kvps;
}

function asFunctionOfShare(probability) {
    if (probability === 1 || probability === 0 || isNaN(probability)) {
        return "( - )";
    }
    let american = String(imp2american(probability));
    const si = american.lastIndexOf(".");
    american = american.substring(0, si !== -1 ? si : american.length);
    const message = "(" + (american > 0 ? "+" : "") + american + ")";
    //console.log(probability, "->", message);
    return message;
}

module.exports = { validate, mode, percentForOpt, sfo, asFunctionOfShare };
