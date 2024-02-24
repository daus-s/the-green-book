function isLoggedIn() {
    if (sessionStorage.getItem('logged-in')==='true')
    {
        return true;
    }
    if (sessionStorage.getItem('logged-in')==='false')
    {
        return false;
    }
}

module.exports = { isLoggedIn }