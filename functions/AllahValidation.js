const VERBOSE = false;

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
    if (!Array.isArray(opsAsList) || opsAsList.length < 2) {
        let message = "Error: function: goodOps args: list<string> ";

        if (!Array.isArray(opsAsList)) {
            message += `  • opsAsList requires list, received ${typeof opsAsList}\n`;
        }

        if (Array.isArray(opsAsList) && opsAsList.length < 2) {
            message += `  • opsAsList requires length ≥ 2, received length ${opsAsList.length}\n`;
        }

        throw new Error(message);
    }

    return opsAsList.every((c) => Boolean(c));
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

function validateBet({ mode, line, group, content, options }) {
    if (VERBOSE) {
        console.log({ mode, line, group, content, options });
    }
    let errors = [];

    if (!["options", "over_under"].includes(mode)) {
        errors.push(
            `  • Invalid mode: expected "options" or "over_under", received "${mode}"`
        );
    }

    if (mode === "over_under" && !isValidLine(line)) {
        errors.push("  • Line must be a valid number for 'over_under' mode");
    }

    if (content.trim() === "") {
        errors.push("  • Content cannot be empty");
    }

    if (
        mode === "options" &&
        (!Array.isArray(options) ||
            options.length < 2 ||
            options.some((opt) => opt.trim() === ""))
    ) {
        errors.push(
            "  • Options must be a non-empty array with at least 2 valid entries"
        );
    }
    const gid = group?.groupID;
    if (group !== null && typeof gid !== "number" && gid >= 0) {
        errors.push(
            "  • Group must be null or a valid unsigned integer identifier"
        );
    }

    if (VERBOSE) {
        if (errors.length) {
            console.error(
                "Error: function validateBet args mode, line, group, content, options\n".concat(
                    errors.join("\n")
                )
            );
        }
    }
    return !errors.length;
}

module.exports = { isValidLine, goodOps, goodWords, validateBet };
