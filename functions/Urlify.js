function urlify(string) {
    if (typeof string === 'string') {
        return string.toLowerCase().replace(' ', '-').replace('\'', '');
    }
}

module.exports = { urlify }