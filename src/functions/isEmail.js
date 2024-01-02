const validEmail = (email) => !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

const validUsername = (str) => !/^[a-zA-Z0-9]+$/.test(str);

module.exports = { validEmail, validUsername }

//TODO: create test suite