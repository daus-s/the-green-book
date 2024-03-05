function random() {
    MAX_VALUE = 2147483647;
    let randomA = Math.floor(Math.random() * MAX_VALUE);
    let randomB = Math.floor(Math.random() * MAX_VALUE);
    let big = BigInt(randomA) << 32n | BigInt(randomB);
    return big;
}

module.exports = { random }