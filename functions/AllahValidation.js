const { isLike } = require("./AllButThisJSON");

const VERBOSE = false;

function isValidLine(x) {
    if (isNumber(x)) {
        if (VERBOSE) {
            console.log("Line must be a valid number.");
        }
        return false;
    }
    if (x % 1 === 0.5) {
        return true;
    }
    return false;
}

function goodOps(opsAsList, create = false) {
    const notList = !Array.isArray(opsAsList);
    const enoughOptions = opsAsList.length < 2;
    const optionValidity = opsAsList.some((e) => !isOption(e, create));
    if (notList || enoughOptions || optionValidity) {
        let message = "Error: function: goodOps args: list<string> ";

        if (notList) {
            message += `  • opsAsList requires list, received ${typeof opsAsList}\n`;
        }

        if (enoughOptions) {
            message += `  • opsAsList requires length ≥ 2, received length ${opsAsList.length}\n`;
        }

        if (optionValidity) {
            message += `  • some of opsAsList are not options, X(\n    Options:\n`;
            for (const option of opsAsList) {
                if (create) {
                    message += `    • expected string, got ${typeof option}\n`;
                }
            }
        }

        throw new Error(message);
    }

    return opsAsList.every((c) => create || Boolean(c));
}

function isOption(option, create = false) {
    // console.log("CREATE BET option type:", typeof option);
    // console.log(`  isOption: isCreate=${create}`);
    if (create) {
        // console.log("  considering as a string. \n  • option type: " + typeof option);
        return typeof option === "string";
    }

    const optionSchema = {
        bid: "number",
        oid: "number",
        winner: "boolean",
        content: "string",
    };

    return isLike(option, optionSchema);
}

function goodWords(words) {
    if (!Array.isArray(words)) {
        throw new Error("words must be a list");
    }

    const illegals = [""]; //TODO: add bad words here
    for (const word of words) {
        if (word in illegals) {
            return false;
        }
    }
    return true;
}

/**
 * returns whether a bet object is valid or not.
 *
 * naturally isHaram tells you that the bet is valid. but because betting is haram,
 * a valid bet is haram. thus u ask !isHaram(bet) to determine
 * @param {*} param0
 * @returns
 */
function isHaram({ line, g, content, options }, create = false) {
    return isHalal({ line, g, content, options }, create);
}

/**
 * isHalal returns a boolean value describing a bet object passed as an argument.
 *
 * An optional parameter can be supplied, the create boolean. this indicates
 * whether the function is being passed a object yet to be created in the
 * database (aka createbeticon).
 *
 *
 * @param {{bet}} param0
 * @param {boolean} create
 * @returns
 */
function isHalal({ line, g, content, options }, create) {
    if (VERBOSE) {
        console.log(line, g, content, options);
    }
    let errors = [];
    const lineStatus = !((create && line === "") || line === null || (isValidLine(line) && optionsOverUnder(options)) || isntWhole(line, options));
    if (lineStatus) {
        if (VERBOSE) {
            console.log(
                JSON.stringify({
                    line: line,
                    type: typeof line,
                })
            );
        }
        errors.push("  • Line must be a valid number");
    }

    if (content.trim() === "") {
        errors.push("  • Content cannot be empty");
    }

    if (!goodOps(options, create)) {
        errors.push("  • Options must be a non-empty array with at least 2 valid entries");
    }

    if (g !== null && typeof g !== "number" && g >= 0) {
        errors.push("  • Group must be null or a valid unsigned integer identifier");
    }

    if (VERBOSE) {
        if (errors.length) {
            console.error("Error: function isHalal args { mode, line, g, content, options }\n".concat(errors.join("\n")));
        }
    }
    return !errors.length;
}

function isntWhole(line, options) {
    if (!Number.isInteger(line)) {
        //this function shouldnt apply
        return false;
    } else {
        const insensitiveEqual = (str1, str2) => {
            return str1.toUpperCase() === str2.toUpperCase();
        };
        const truths = [false, false, false];
        for (const option of options) {
            if (insensitiveEqual(option.content, "over")) {
                truths[0] = true;
            }
            if (insensitiveEqual(option.content, "under")) {
                truths[1] = true;
            }
            if (insensitiveEqual(option.content, "line")) {
                truths[2] = true;
            }
        }
        return truths.every((x) => x);
    }
}

function optionsOverUnder(options) {
    const truths = [false, false];
    for (const option of options) {
        if (insensitiveEqual(option.content, "over")) {
            truths[0] = true;
        }
        if (insensitiveEqual(option.content, "under")) {
            truths[1] = true;
        }
    }
    return truths.length === 3 && truths.every((x) => x);
}

const isNumber = (value) => typeof value === "number" && value === value && value !== Infinity && value !== -Infinity;

module.exports = {
    isValidLine,
    goodOps,
    goodWords,
    isHaram,
    isOption,
    isNumber,
};
