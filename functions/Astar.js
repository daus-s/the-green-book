//ASAR aka astar
//auth suite anti redirect

function doReload(path ) {
    //could also be get ending /this-parrt-here -> this-part-here then check in some list
    return ! (path.endsWith('/') || path.endsWith('/login') || path.endsWith('/sign-up') || path.endsWith('/forgot-password') || path.endsWith('/reset-password'))
}

module.exports = {doReload}