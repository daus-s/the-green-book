import { isLike } from "./AllButThisJSON";

const VERBOSE = true;

function isValidLine(x) {
    if (typeof x !== "number") {
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

function goodOps(opsAsList) {
    if (!Array.isArray(opsAsList) || opsAsList.length < 2 || opsAsList.some()) {
        let message = "Error: function: goodOps args: list<string> ";

        if (!Array.isArray(opsAsList)) {
            message += `  • opsAsList requires list, received ${typeof opsAsList}\n`;
        }

        if (Array.isArray(opsAsList) && opsAsList.length < 2) {
            message += `  • opsAsList requires length ≥ 2, received length ${opsAsList.length}\n`;
        }

        if (opsAsList.some((e) => isOption(e))) {
        }

        throw new Error(message);
    }

    return opsAsList.every((c) => Boolean(c));
}

function isOption(option) {
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

function isHaram({ line, g, content, options }) {
    return !isHalal({ line, g, content, options });
}

function isHalal({ line, g, content, options }) {
    if (VERBOSE) {
        console.log({ line, g, content, options });
    }
    let errors = [];

    if (line !== null && !(isValidLine(line) || isntWhole(line, options))) {
        errors.push("  • Line must be a valid number");
    }

    if (content.trim() === "") {
        errors.push("  • Content cannot be empty");
    }

    if (!Array.isArray(options) || options.length < 2 || options.some((opt) => opt.content.trim() === "")) {
        errors.push("  • Options must be a non-empty array with at least 2 valid entries");
    }

    if (g !== null && typeof g !== "number" && g >= 0) {
        errors.push("  • Group must be null or a valid unsigned integer identifier");
    }

    if (VERBOSE) {
        if (errors.length) {
            console.error("Error: function validateBet args { mode, line, g, content, options }\n".concat(errors.join("\n")));
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
        return truths.length === 3 && truths.every((x) => x);
    }
}

module.exports = { isValidLine, goodOps, goodWords, isHalal, isHaram, isOption };
