function height(windowWidth) {
    return 9 + 1.9375 * fontSize(windowWidth);
}

function margin(windowWidth) {
    return Math.max(height(windowWidth) / 7.1, 5);
}

function fontSize(windowWidth) {
    if (windowWidth > 1513) {
        return 32;
    }
    if (windowWidth < 682) {
        return 12;
    }
    return 0.02527075812274368231046931407942 * windowWidth - 6.2346570397111913357400722021661;
}

module.exports = { height, margin, fontSize };
