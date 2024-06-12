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
    let filtered = [...ls];
    const unrespondedFriendRequestCondition = (a) => !(a?.code === 1 && a?.value !== 0);

    const combinedCondition = unrespondedFriendRequestCondition; //&& true;

    filtered = filtered.filter(combinedCondition);

    return filtered;
}

module.exports = { count, select };
