/**
 *
 * @param {List} ls
 * @returns {int}
 */
function count(ls) {
    let sum = 0;
    for (const l of ls) {
        if (!l.viewed) {
            sum++;
        }
    }
    return sum;
}

/**
 * takes a list of notifications and determines whether to return them or not
 * @param {list} ls
 */
function select(ls) {
    return ls;
}

module.exports = { count, select };
