function commute(a, b) {
    return `and(a.eq.${a},b.eq.${b}), and(a.eq.${b},b.eq.${a})`;
}

module.exports = { commute };
