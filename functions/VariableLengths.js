function height(windowWidth) {
    return 9 + 1.9375*fontSize(windowWidth);
}

function margin(windowWidth) {
    return Math.max(height(windowWidth)/7.10, 5)
}

function fontSize(windowWidth) {
    if (windowWidth > 1425) {
        return 32;
    }
    if (windowWidth < 682) {
        return 12;
    }
    return (.0277777777777777*windowWidth - 8);
}

module.exports = {height, margin, fontSize}