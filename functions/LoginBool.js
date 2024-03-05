import useSessionStorage from "../hooks/SessionStorage";

function isLoggedIn() {
    const status = useSessionStorage('logged-in');
    if (status==='true')
    {
        return true;
    }
    if (status==='false')
    {
        return false;
    }
}

module.exports = { isLoggedIn }