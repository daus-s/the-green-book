//ASAR aka astar
//auth suite anti redirect

function doReload(path) {
    //could also be get ending /this-parrt-here -> this-part-here then check in some list
    return !(path.endsWith("/") || path.endsWith("/login") || path.endsWith("/register") || path.endsWith("/forgot-password") || path.endsWith("/reset-password"));
}

function nthPageUp(str, n) {
    let substr = str;
    while (n > 0) {
        substr = substr.substring(0, substr.lastIndexOf("/"));
        n--;
    }
    return substr;
}

module.exports = { doReload, nthPageUp };
