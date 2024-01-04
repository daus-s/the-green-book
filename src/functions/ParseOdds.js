//american odds checker
function validOdds (intstr) {
    if (intstr.length==0) return true;
    if (intstr.length==1) return (intstr.charAt(0) === '+' || intstr.charAt(0) === '-');
    if (typeof intstr == 'string') {
        return (intstr.charAt(0) === '+' || intstr.charAt(0) === '-') && parseInt(intstr.substring(1)) !== NaN;
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

module.exports = { validOdds, validLine }