//functions and operatoprs for the Bet2 DataStructure

const { isHaram, isOption, isNumber } = require("./AllahValidation");
const { imp2american } = require("./CalculateProbabilities");

/* SCHEMA
 *
 *
 * bets2%ROWTYPE
 * ___________________________________________________________________________________________________________
 * | id PK, unq | content  | creator FK -> public_users.id | public | open | g FK -> groups.groupID | line   |
 * | int8, seq  | text     | int4                          | bool   | bool | int4                   | float4 | = 22+strlen(context)
 * -----------------------------------------------------------------------------------------------------------   SIZE
 *
 * options%ROWTYPE
 * _____________________________________________
 * | bid FK (pk) | oid (pk) | context | winner |
 * | int8        | int2 ms  | text    | flag   |
 * ---------------------------------------------
 *
 * wagers%ROWTYPE
 * ___________________________________________________
 * | bid FK (pk) | oid (pk) FK | uid FK (pk)| amount |
 * | int8        | int2 ms     | int4       | int4   |
 * ---------------------------------------------------
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
    } else if (line === null) {
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

/*
 * named for what ...???
 *
 */
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
        //a little meta data
        kvp.wagers = val;
        kvp.sum = sum;

        kvps.push(kvp);
    }
    return kvps;
}

function bettingSheet(bet) {
    if (!isHaram(bet)) {
        return null;
    } else {
        return sfo(bet.options, bet.wagers);
    }
}

function asFunctionOfShare(probability) {
    if (probability === 1 || probability === 0 || isNaN(probability)) {
        return " - ";
    }
    let american = String(imp2american(probability));
    const si = american.lastIndexOf(".");
    american = american.substring(0, si !== -1 ? si : american.length);
    const message = (american > 0 ? "+" : "") + american;
    //console.log(probability, "->", message);
    return message;
}

function tokenSum(sum) {
    let per = sum;
    let count = 0;
    while (per >= 1000) {
        per /= 1000;
        count++;
    }
    const cntind = ["", "K", "M", "B", "T"];
    const after = (i) => {
        let mess = "E+";
        mess += 3 * i;
        return mess;
    };
    let unit;
    if (count < cntind.length) {
        unit = cntind[count];
    } else {
        unit = after(count);
    }

    let numstr;
    if (per < 1000 && per >= 100) {
        const purse = String(per);
        numstr = purse.substring(0, 3); // 3 digits
    } else if (per < 100) {
        const purse = String(per);
        numstr = purse.substring(0, 4); // 4 digits
    }
    // !numstr ? console.warn("numstr response: \n", numstr) : console.log("numstr response: \n", numstr);
    return numstr + unit;
}

function optToJson(content, betId, optionalIndex) {
    console.log(content, betId, optionalIndex);
    if (!(typeof content === "string" && isNumber(betId) && isNumber(optionalIndex) && optionalIndex >= 0 && optionalIndex < 65536)) {
        const message =
            "called optToJson poorly\n" +
            (typeof content === "string" ? "" : "  • content is not a string\n") +
            (isNumber(betId) ? "" : "  • betId is not a number, expected int8, receieved " + typeof betId + "\n") +
            (isNumber(optionalIndex) ? "" : "  • optionalIndex (oid) is not a number expected int2, receieved " + typeof optionalIndex + "\n") +
            (optionalIndex >= 0 && optionalIndex < 65536 ? "" : "  • oid is not properly bounded [0, 65536)");
        throw new Error(message);
    }
    const json = {
        winner: false,
        bid: betId,
        oid: optionalIndex,
        content: content,
    };
    return json;
}

function userPick(bet, id) {
    if ((!bet && bet.wagers) || (typeof id !== "number" && !isNaN(id))) {
        return null;
    }

    for (const w of bet.wagers) {
        if (w.uid === id) {
            return w;
        }
    }

    return null;
}

/** this is a cool function */
function firstOpenOId(options) {
    options.sort((a, b) => a.oid - b.oid);
    let prev = -1;
    let curr;

    for (const option of options) {
        curr = option.oid;
        if (curr - prev !== 1) {
            return prev + 1;
        }
        prev = curr;
    }

    return prev + 1;
}

function predictedWinning(bet, id) {
    if (!validate(bet) || !id) {
        throw new Error("Error: predictedWinning" + (!validate(bet) ? "\n  • bet must be a bet like object" : "") + (!id ? "\n  • id must be an integer" : ""));
    }
    const wager = userPick(bet, id);
    if (!wager) {
        //not placed yet
        return 0;
    }
    const { amount } = wager;
    const optSum = specificOptionSum(bet, wager.oid);
    const betSum = totalBetSum(bet);
    return Math.floor((amount / optSum) * betSum); /** as a share of the winning selections  */
}

function totalBetSum(bet) {
    if (!validate(bet)) {
        throw new Error("bet must be a bet like object");
    }
    let sum = 0;
    for (const wager of bet.wagers) {
        sum += wager.amount;
    }
    return sum;
}

function specificOptionSum(bet, oid) {
    if (!validate(bet)) {
        throw new Error("bet must be a bet like object");
    }
    let sum = 0;
    for (const wager of bet.wagers) {
        if (wager.oid === oid) {
            sum += wager.amount;
        }
    }
    return sum;
}

function validateOptions(oid, optionList) {
    const errors = [];

    if (typeof oid !== "number") {
        errors.push(`'oid' must be a number, received ${typeof oid}`);
    }

    if (!Array.isArray(optionList)) {
        errors.push(`'optionList' must be an array, received ${typeof optionList}`);
    }

    if (errors.length > 0) {
        throw new Error(`Invalid input: \n• ${errors.join("\n• ")}`);
    }

    return true; // Passed validation
}

function contentFromOId(oid, optionList) {
    validateOptions(oid, optionList);

    for (const option of optionList) {
        if (option.oid === oid) {
            return option.content;
        }
    }
}

function isWinner(option) {
    if (!isOption(option)) {
        return undefined;
    }
    return option.winner;
}

module.exports = {
    validate,
    mode,
    percentForOpt,
    sfo,
    asFunctionOfShare,
    tokenSum,
    optToJson,
    userPick,
    firstOpenOId,
    predictedWinning,
    contentFromOId,
    bettingSheet,
    isWinner,
};
