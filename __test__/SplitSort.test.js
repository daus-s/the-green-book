const { splitnSort } = require("../functions/AllButThisJSON");

const data = [
    { name: "tb", val: 1, cut: true },
    { name: "ck", val: 2, cut: false },
    { name: "jugg", val: 3, cut: true },
    { name: "fv", val: 4, cut: true },
    { name: "mk", val: 5, cut: false },
    { name: "morp", val: 6, cut: false },
];

describe("sorts the listed based on a boolean criteria pttuing true condidtions at the top and flase conditions at the bottom maintaing original order", () => {
    data.sort((a, b) => a.val - b.val); //redundant look how i made the list
    it("should place the sorted trues above the sorted falses", () => {
        expect(splitnSort(data, "cut")).toEqual([
            { name: "tb", val: 1, cut: true },
            { name: "jugg", val: 3, cut: true },
            { name: "fv", val: 4, cut: true },
            { name: "ck", val: 2, cut: false },
            { name: "mk", val: 5, cut: false },
            { name: "morp", val: 6, cut: false },
        ]);
    });
});
