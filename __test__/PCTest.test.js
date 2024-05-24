const { partition, coerce } = require('../functions/RandomBigInt');

describe('coerce ints into single data point', () => {

    it('check partion and coercion ', () => {
        expect(coerce(...partition(0x00000000))).toEqual(0);
    });
    it('check partion of a coereced int is its original', () => {
        expect(partition(coerce(53, 64, 67, 3))).toEqual([53, 64, 67, 3]);
    });
    it('check coercion of partitioned valid int is its original', () => {
        expect(coerce(...partition(0x11f53c08))).toEqual(0x11f53c08);
    });
});
