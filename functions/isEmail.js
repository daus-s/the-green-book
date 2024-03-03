const validEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const validUsername = (str) => /^[a-zA-Z0-9]+$/.test(str);

const alpha = (str) => /^[a-zA-Z]+$/.test(str)

module.exports = { validEmail, validUsername, alpha }

//TODO: create test suite