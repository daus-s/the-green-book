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
    let a = false;
    const parts = string.split('_')
    if (parts.length!==3) {
        return false;
    }
    let year = parseInt(parts[0]);
    let rank = parseInt(parts[1]);

    a = typeof year === "number" && !isNaN(year) && year > 2022; 
    b = typeof rank === "number" && !isNaN(rank); 
    c = parts[2] in ['masters', 'pga', '', '']
    return true
}

function seperated(string) {
    //i may be overengineering the fuck out of this
    const parts = string.split('_');
}

module.exports = { parseable }