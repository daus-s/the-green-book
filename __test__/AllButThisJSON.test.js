const { allButThis, jsql } = require("../functions/AllButThisJSON");

describe("AllButThisJSON", () => {
    const list = [{ key: "value" }, { one: 1 }, { two: 2 }];

    it("should filter out objects from the list", () => {
        const element = { key: "value" };
        const filteredList = allButThis(list, element);
        expect(filteredList).toEqual([{ one: 1 }, { two: 2 }]);
    });

    it("should filter nothing if element isnt defined and return the original list", () => {
        const element = undefined;
        const filteredList = allButThis(list, element);
        expect(filteredList).toEqual([
            { key: "value" },
            { one: 1 },
            { two: 2 }
        ]);
    });
});

//does this function commute? can we use a reflection to make it commute (x,y)->(y,x)
describe("jsql", () => {
    const obj1 = { a: "a", b: 2 };
    const obj2 = { b: 2, a: "a" };
    const obj3 = { a: "a" };
    const obj4 = { a: 2, b: "a" };
    const obj5 = { d: 123 };
    const obj6 = { a: "a", b: 2, c: true, d: { nested: "comparator" } };
    const objE = {};

    it("should tell that A===A", () => {
        expect(jsql(obj1, obj1)).toBe(true);
    });
    it("should return that equal but unordered objects are equal", () => {
        expect(jsql(obj1, obj2)).toBe(true);
    });
    it("should return that equal objects are equal", () => {
        expect(jsql(obj1, obj3)).toBe(false);
    });
    it("should return that objects of same dimensions but different values are not equal", () => {
        expect(jsql(obj1, obj4)).toBe(false);
    });
    it("should return that equal objects are equal", () => {
        expect(jsql(obj1, obj5)).toBe(false);
    });
    it("should return that a longer object is not equal", () => {
        expect(jsql(obj1, obj6)).toBe(false);
    });
    it("should return that a populated objects is not the empty set", () => {
        expect(jsql(obj1, objE)).toBe(false);
    });
});
