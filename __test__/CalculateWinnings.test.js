const {american} = require('../functions/CalculateWinnings.js'); // Adjust the path based on your project structure

describe('american function', () => {
  it('calculates potential winnings for positive odds', () => {
    const positiveOdds = 150;
    const wager = 100;
    const result = american(positiveOdds, wager);
    expect(result).toEqual(250); // Adjust the expected result based on your logic
  });

  it('calculates potential winnings for negative odds', () => {
    const negativeOdds = -150;
    const wager = 100;
    const result = american(negativeOdds, wager);
    expect(result).toEqual(166.66666666666666); // Adjust the expected result based on your logic
  });

  it('throws an error for non-number wager', () => {
    expect(() => american(150, 'invalid')).toThrow('Both odds and wager must be numbers.');
  });

});