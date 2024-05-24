const { nthPageUp } = require("../functions/Astar");

describe("coerce ints into single data point", () => {
    it("partition 1 integer in 4 shorts", () => {
        expect(nthPageUp("http://localhost:32111/pga/masters-2023/bet/@G", 2)).toEqual("http://localhost:32111/pga/masters-2023");
    });
});
