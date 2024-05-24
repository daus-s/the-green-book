function translate(str) {
    if (str==="overUnder") {
        return "ou";
    }
    if (str==="moneyline") {
        return "ml";
    }
    if (str==="options") {
        return "op";
    }
}

function trnslt(str) { //go from short 2 char string to full string
    if (str.length !== 2) {
        throw new Error('illegal length of mode string. must be 2 characters'); //could make this in the set
    }
    if (str==="ou") {
        return "Over-Under";
    }
    if (str==="ml") {
        return "Moneyline";
    }
    if (str==="op") {
        return "Option";
    }
    else {
        throw new Error('unsupported bet type. not in the set={ou, ml, op}.')
    }
}

module.exports = {translate, trnslt}
