const { numLength } = require("../functions/RandomBigInt");

describe("numLength", () => {
    const list = [{ key: "value" }, { one: 1 }, { two: 2 }];

    it("should return the length of the positive string", () => {
        expect(numLength(10)).toBe(2);
    });

    it("should return length 1 if n is 0", () => {
        expect(numLength(0)).toBe(1);
    });
});
