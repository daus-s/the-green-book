const { firstOpenOId } = require("../functions/Bet2Ops");

describe("first opening function", () => {
    const list1 = [{ oid: 0 }, { oid: 1 }, { oid: 3 }]; //expect 2
    const list2 = [{ oid: 4 }, { oid: 1 }, { oid: 2 }]; //expect 0
    const list3 = []; //expect 0
    const list4 = [{ oid: 0 }, { oid: 1 }, { oid: 2 }]; //expect 3

    it("should return open slot", () => {
        expect(firstOpenOId(list1)).toBe(2);
    });
    it("should return open slot", () => {
        expect(firstOpenOId(list2)).toBe(0);
    });
    it("should return open slot", () => {
        expect(firstOpenOId(list3)).toBe(0);
    });
    it("should return open slot", () => {
        expect(firstOpenOId(list4)).toBe(3);
    });
});
