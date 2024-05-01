function urlify(string) {
    if (typeof string === 'string') {
        return (string.toLowerCase().replaceAll(' ', '-').replaceAll('\'', ''));
    }
}

module.exports = { urlify }