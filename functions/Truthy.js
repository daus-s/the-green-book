function cook(condition) {
    if (condition) {
        return 'truthy';
    }
    else {
        return 'falsy';
    }
}

module.exports = { cook }