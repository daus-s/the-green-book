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

/**
 * Validates a URL extension string to check if it matches expected formats.
 *
 * @param {string} str - The URL extension string to validate.
 * @returns {boolean} True if the URL extension string is valid; otherwise, false.
 *
 * Valid URL extensions:
 * - "masters-2024"
 * - "masters-2023"
 * - "pga-championship-2024"
 * - "open-us-2024"
 */
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

/**
 * Retrieves the tournament ID based on the provided full tournament name.
 *
 * @param {string} fullname - The full name of the tournament.
 * @returns {string} The corresponding tournament ID.
 * @throws {Error} Throws an error if the provided tournament name is not recognized.
 *
 * Valid tournament names and their corresponding IDs:
 * - "Masters" -> "masters"
 * - "PGA Championship" -> "pgachamps"
 * - "US Open" -> "usopen"
 * - "The Open" -> "theopen"
 */
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

/**
 * Validates a fantasy league bet object to ensure it meets expected criteria.
 *
 * @param {object} bet - The bet object to validate.
 * @returns {boolean} True if the bet object is valid; otherwise, false.
 *
 * Expected fields in the bet object:
 * - public_id: number (required) - The ID of the bet.
 * - players: number or null (optional) - Number of players in the league, or null if unspecified.
 * - league_id: number (required) - The ID of the fantasy league associated with the bet.
 * - tournament_id: number (required) - The ID of the tournament associated with the bet.
 */
function goodFantasy(bet) {
    if (!bet) {
        return false;
    }
    return typeof bet.public_id === "number" && (typeof bet.players === "number" || bet.players === null) && typeof bet.league_id === "number" && typeof bet.tournament_id === "number";
}

/**
 * Validates a head to head bet object to ensure it meets expected criteria.
 *
 * @param {object} bet - The bet object to validate.
 * @returns {boolean} True if the bet object is valid; otherwise, false.
 *
 * Expected fields in the bet object:
 * - public_id: number (required)
 * - players: number or null (optional)
 * - alternates: number or null (optional)
 * - oppie: number (required)
 * - tournament_id: number (required)
 */
function goodHead2Head(bet) {
    if (!bet) {
        return false;
    }
    return (
        typeof bet.public_id === "number" &&
        (typeof bet.players === "number" || bet.players === null) &&
        (typeof bet.alternates === "number" || bet.alternates === null) &&
        typeof bet.oppie === "number" &&
        typeof bet.tournament_id === "number"
    );
}

module.exports = { parseable, seperated, validateFields, validateUrlext, getTid, goodFantasy, goodHead2Head };
