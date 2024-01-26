// makeRandom.test.js
const { random } = require('../src/functions/RandomBigInt.js'); 

describe('random check', () => {
  test('Does it generate', () => {
    expect(typeof random().toBe(BigInt))
  });
  // Add more test cases as needed
});

