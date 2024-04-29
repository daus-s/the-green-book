function podiumColors(i) {
    if (i===1) {
        return 'var(--gold)';
    }
    if (i===2) {
        return 'var(--silver)';
    }
    if (i===3) {
        return 'var(--bronze)';
    }
    return 'inherit';
}

module.exports = {
    podiumColors
}