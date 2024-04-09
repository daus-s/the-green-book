const { allButThis } = require('../functions/AllButThisJSON');

describe('AllButThisJSON', () => {
    const list = [{ key: 'value' }, {one: 1}, {two: 2}];

    it('should filter out objects from the list', () => {
        const element = { key: 'value' };
        const filteredList = allButThis(list, element);
        expect(filteredList).toEqual([{one: 1}, {two: 2}]);
    });

    it('should filter nothing if element isnt defined and return the original list', () => {
        const element = undefined;
        const filteredList = allButThis(list, element);
        expect(filteredList).toEqual([{ key: 'value' }, {one: 1}, {two: 2}]);
    });
});
