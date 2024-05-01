const { validateFields } = require('../functions/ParseSchema');

describe('validate a good object ', () => {

    it('masters 2024 naming', () => {
        expect(validateFields({year: 2023, tournament: 'masters'})).toBe(true);
    });
});
