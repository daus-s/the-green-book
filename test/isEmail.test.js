// test.js
const { validEmail, validUsername } = require('../src/functions/isEmail.js'); // Replace with the actual filename

describe('Email Validation', () => {
  test('Valid Email Format', () => {
    expect(validEmail('user@example.com')).toBe(true);
  });

  test('Invalid Email Format', () => {
    expect(validEmail('invalid-email')).toBe(false);
  });

  // Add more test cases as needed
});

describe('Username Validation', () => {
  test('Valid Username Format', () => {
    expect(validUsername('validUsername123')).toBe(true);
  });

  test('Invalid Username Format', () => {
    expect(validUsername('invalid@username')).toBe(false);
  });

  // Add more test cases as needed
});