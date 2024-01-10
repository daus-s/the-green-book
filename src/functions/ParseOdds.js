//american odds checker
function validOdds (intstr) {
    if (intstr.length==0) return true;
    if (intstr.length==1) return (intstr.charAt(0) === '+' || intstr.charAt(0) === '-');
    if (typeof intstr == 'string') {
        const parsedNumber = Number(intstr);
        return (intstr.charAt(0) === '+' || intstr.charAt(0) === '-') && !isNaN(parsedNumber) && Number.isInteger(parsedNumber);
    }
    return false;
}


function validLine(intstr) {
    if (intstr.length==0) return true;
    if (typeof intstr == 'string') {
        return parseFloat(intstr) !== NaN && parseFloat(intstr)*2%1===0;
    }
    return false;
}

function formatOdds(int) {
    return int<0?int:"+"+int;
}

function getNumber(str) {
    if (validOdds(str)) {
        let m = str.charAt(0)=='-'?-1:1; //multiplier ident negative or positive
        return m*parseInt(str.substring(1));
    }
    throw new Error("Bad formatting of odds");
}

module.exports = { validOdds, validLine, formatOdds, getNumber }
