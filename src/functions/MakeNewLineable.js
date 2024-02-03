//todo make add space every 6...
function lineable(str) {
    let i = 0;
    let lineated = "";
    while ((i) * 6 < str.length) 
    {
        lineated += str.substring((i*6), (i+1)*6) + "\n";
        i++;
    }
    return lineated;
}

function shorten(str) {
    return str.substring(0,6) + "...";
}

module.exports = { lineable, shorten }