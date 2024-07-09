function random() {
    MAX_VALUE = 2147483647;
    let randomA = Math.floor(Math.random() * MAX_VALUE);
    let randomB = Math.floor(Math.random() * MAX_VALUE);
    let big = (BigInt(randomA) << 32n) | BigInt(randomB);
    return big;
}
/**
 * returns the combination of 4 integers bounded 0, 255 inclusive inclusive
 * when called on a result of partition it must be "destructured"
 *        i1       i2       i3       i4
 *        aaaaaaaa bbbbbbbb cccccccc dddddddd
 * result ________|________|________|________
 * @param {number} i1
 * @param {number} i2
 * @param {number} i3
 * @param {number} i4
 * @return {number}
 */
function coerce(i1, i2, i3, i4) {
    const bounded = (i) => i < 256 && i > -1;
    if (!(bounded(i1) && bounded(i2) && bounded(i3) && bounded(i4))) {
        throw Error(`integers for coersion must be between 0 and 255 inclusive inclusive\ni:=[0, 255]\n • i1=${i1}\n • i2=${i2}\n • i3=${i3}\n • i4=${i4}`);
    }
    //return single number
    let a = i1 << 24;
    let b = i2 << 16;
    let c = i3 << 8;
    let d = i4;
    return a | b | c | d;
}

/**
 * returns the partitioned number in 32 bits as 4 numbers between [0,255]
 *     bi ________|________|________|________
 *        aaaaaaaa bbbbbbbb cccccccc dddddddd
 *        a        b        c        d
 * @param {number} bi
 * @return {list[number]}
 */
function partition(bi) {
    if (bi === null) {
        return [null, null, null, null];
    }
    const a = (bi & 0xff000000) >>> 24;
    const b = (bi & 0x00ff0000) >>> 16;
    const c = (bi & 0x0000ff00) >>> 8;
    const d = (bi & 0x000000ff) >>> 0;
    return [a, b, c, d];
}

function warn(x) {
    if (Number.isSafeInteger(x)) {
        console.warn("Precision safe.");
        return 1;
    }
    console.warn("Precision may be lost!");
    return 0;
}

module.exports = { random, coerce, partition, warn };
