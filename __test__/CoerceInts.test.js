const { coerce } = require('../functions/RandomBigInt');

describe('coerce ints into single data point', () => {

    it('convert 4 bounded ints into single integer', () => {
        const a = 0;
        const b = 0;
        const c = 0;
        const d = 0;
        expect(coerce(a,b,c,d)).toEqual(0);
    });

    it('throws if the integers are not bound', () => {
        const a = -1;
        const b = 0;
        const c = 0;
        const d = 0;
        expect(()=>{
            coerce(a,b,c,d)
        }).toThrow();
    });

    it('all 1s makes a big fat negative 1', () => {
        const a = 255; 
        const b = 255;
        const c = 255;
        const d = 255;
        expect(coerce(a,b,c,d)).toEqual(-1);
    });
    it('sign check', () => {
        const a = 0b10000000;
        const b = 0;
        const c = 0;
        const d = 0;
        expect(coerce(a,b,c,d)/Math.abs(coerce(a,b,c,d))).toEqual(-1);
    });
    it('value check on 0b10000...', () => {
        const a = 0b10000000;
        const b = 0;
        const c = 0;
        const d = 0;
        expect(coerce(a,b,c,d)).toEqual(-0b1000_0000_0000_0000_0000_0000_0000_0000);
    });

});
