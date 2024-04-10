function bigify(ints) {
    if (!Array.isArray(ints) || ints.length!==8) {
        throw Error("bigify requires 8 integers")
    }
    for (let i = 0; i < 8; ++i) {
        if (ints[i] < 0 || ints[i] > 255) {
            throw Error("all ints to bigify must be bounded by 0<=i<=255")
        }
    }
    //everything is checked
}