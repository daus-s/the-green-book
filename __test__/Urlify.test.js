const { urlify } = require('../functions/Urlify');

describe('urlify a given string ', () => {

    it('masters 2024 naming', () => {
        expect(urlify('Masters 2024')).toEqual('masters-2024');
    });

    it('should work for (m)any words', () => {
        expect(urlify('a\'S 69')).toEqual('as-69');
    });

    it('moves the year to the end with a different name', () => {
        expect(urlify('2023 Masters')).toEqual('masters-2023');
    });

    it('only works on strings', () => {
        const notAString = 69
        expect(()=>{
            urlify(notAString)
        }).toThrow();
    });
});
