const { partition } = require('../functions/RandomBigInt');

describe('coerce ints into single data point', () => {

    it('partition 1 integer in 4 shorts', () => {
        expect(partition(0x00000000)).toEqual([0,0,0,0]);
    });

    it('partition 1 integer in 4 shorts with a negative integer', () => {
        expect(partition(-1)).toEqual([255,255,255,255]);
    });
    it('partition 1 integer in 4 shorts', () => {
        expect(partition(0xff_ff_ff_ff)).toEqual([255,255,255,255]);
    });

    it('partition 1 integer in 4 shorts', () => {
        expect(partition(0x7f_ff_ff_ff)).toEqual([127,255,255,255]);
    });
});
