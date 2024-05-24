/**
 * Converts a string into a URL-friendly format by replacing spaces with hyphens.
 * If the string starts with a number, it moves the number to the end.
 *
 * @param {string} str - The string to convert.
 * @returns {string} The URL-friendly version of the input string.
 */
function urlify(str) {
    if (typeof str === "string") {
        const tkns = str.split(" ");
        if (tkns.length && !isNaN(parseInt(tkns[0]))) {
            const tmp = tkns[tkns.length - 1];
            tkns[tkns.length - 1] = tkns[0];
            tkns[0] = tmp;
            str = tkns.join(" ");
        }
        return str.toLowerCase().replaceAll(" ", "-").replaceAll("'", "");
    }
    throw Error("cannot urlify anything but a string");
}

module.exports = { urlify };
