const { evaluateTeamAndAlternate, getTeamScore, scoreFromGolfer, determineOrderAndEvaluate } = require("../functions/GolfFunctions");
const { partition, coerce } = require("../functions/RandomBigInt");

const tourney = [
    { _id: "6632d49713dbce1a8cf15cb4", name: "Jon Rahm", thru: 0, round: -3, rd1: 65, rd2: 69, rd3: 73, rd4: 69, strokes: 276, total: -12, index: 18, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cb5", name: "Phil Mickelson", thru: 0, round: -7, rd1: 71, rd2: 69, rd3: 75, rd4: 65, strokes: 280, total: -8, index: 30, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cb6", name: "Brooks Koepka", thru: 0, round: 3, rd1: 65, rd2: 67, rd3: 73, rd4: 75, strokes: 280, total: -8, index: 3, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cb7", name: "Jordan Spieth", thru: 0, round: -6, rd1: 69, rd2: 70, rd3: 76, rd4: 66, strokes: 281, total: -7, index: 19, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cb8", name: "Patrick Reed", thru: 0, round: -4, rd1: 71, rd2: 70, rd3: 72, rd4: 68, strokes: 281, total: -7, index: 29, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cb9", name: "Russell Henley", thru: 0, round: -2, rd1: 73, rd2: 67, rd3: 71, rd4: 70, strokes: 281, total: -7, index: 31, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cba", name: "Cameron Young", thru: 0, round: -4, rd1: 67, rd2: 72, rd3: 75, rd4: 68, strokes: 282, total: -6, index: 5, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cbb", name: "Viktor Hovland", thru: 0, round: 2, rd1: 65, rd2: 73, rd3: 70, rd4: 74, strokes: 282, total: -6, index: 50, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cbc", name: "Sahith Theegala", thru: 0, round: -5, rd1: 73, rd2: 70, rd3: 73, rd4: 67, strokes: 283, total: -5, index: 33, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cbd", name: "Matthew Fitzpatrick", thru: 0, round: -2, rd1: 70, rd2: 72, rd3: 72, rd4: 70, strokes: 284, total: -4, index: 25, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cbe", name: "Scottie Scheffler", thru: 0, round: -2, rd1: 68, rd2: 75, rd3: 71, rd4: 70, strokes: 284, total: -4, index: 37, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cbf", name: "Xander Schauffele", thru: 0, round: -1, rd1: 68, rd2: 74, rd3: 71, rd4: 71, strokes: 284, total: -4, index: 51, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cc0", name: "Collin Morikawa", thru: 0, round: 0, rd1: 69, rd2: 69, rd3: 74, rd4: 72, strokes: 284, total: -4, index: 8, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cc1", name: "Gary Woodland", thru: 0, round: 0, rd1: 68, rd2: 72, rd3: 73, rd4: 72, strokes: 285, total: -3, index: 11, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cc2", name: "Patrick Cantlay", thru: 0, round: 3, rd1: 71, rd2: 71, rd3: 68, rd4: 75, strokes: 285, total: -3, index: 28, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cc3", name: "Tom Kim", thru: 0, round: -2, rd1: 70, rd2: 72, rd3: 74, rd4: 70, strokes: 286, total: -2, index: 46, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cc4", name: "Sungjae Im", thru: 0, round: 0, rd1: 71, rd2: 76, rd3: 67, rd4: 72, strokes: 286, total: -2, index: 42, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cc5", name: "Joaquin Niemann", thru: 0, round: 0, rd1: 71, rd2: 69, rd3: 74, rd4: 72, strokes: 286, total: -2, index: 17, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cc6", name: "Shane Lowry", thru: 0, round: 1, rd1: 68, rd2: 72, rd3: 73, rd4: 73, strokes: 286, total: -2, index: 40, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cc7", name: "Justin Rose", thru: 0, round: 1, rd1: 69, rd2: 71, rd3: 73, rd4: 73, strokes: 286, total: -2, index: 20, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cc8", name: "Sam Bennett(a)", thru: 0, round: 2, rd1: 68, rd2: 68, rd3: 76, rd4: 74, strokes: 286, total: -2, index: 34, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cc9", name: "Hideki Matsuyama", thru: 0, round: 3, rd1: 71, rd2: 70, rd3: 70, rd4: 75, strokes: 286, total: -2, index: 14, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cca", name: "Keegan Bradley", thru: 0, round: -1, rd1: 70, rd2: 72, rd3: 74, rd4: 71, strokes: 287, total: -1, index: 22, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ccb", name: "Chris Kirk", thru: 0, round: -1, rd1: 70, rd2: 74, rd3: 72, rd4: 71, strokes: 287, total: -1, index: 7, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ccc", name: "K.H. Lee", thru: 0, round: 0, rd1: 74, rd2: 67, rd3: 74, rd4: 72, strokes: 287, total: -1, index: 21, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ccd", name: "Tony Finau", thru: 0, round: 0, rd1: 69, rd2: 74, rd3: 73, rd4: 72, strokes: 288, total: 0, index: 48, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cce", name: "Scott Stallings", thru: 0, round: 0, rd1: 70, rd2: 77, rd3: 69, rd4: 72, strokes: 288, total: 0, index: 36, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ccf", name: "Ryan Fox", thru: 0, round: 1, rd1: 70, rd2: 71, rd3: 74, rd4: 73, strokes: 288, total: 0, index: 32, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cd0", name: "Sam Burns", thru: 0, round: 0, rd1: 68, rd2: 71, rd3: 78, rd4: 72, strokes: 289, total: 1, index: 35, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cd1", name: "Si Woo Kim", thru: 0, round: 0, rd1: 73, rd2: 72, rd3: 72, rd4: 72, strokes: 289, total: 1, index: 41, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cd2", name: "Harold Varner III", thru: 0, round: -2, rd1: 72, rd2: 71, rd3: 76, rd4: 70, strokes: 289, total: 1, index: 12, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cd3", name: "Mackenzie Hughes", thru: 0, round: -2, rd1: 76, rd2: 69, rd3: 74, rd4: 70, strokes: 289, total: 1, index: 24, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cd4", name: "Tommy Fleetwood", thru: 0, round: 2, rd1: 72, rd2: 71, rd3: 74, rd4: 74, strokes: 291, total: 3, index: 47, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cd5", name: "Tyrrell Hatton", thru: 0, round: 4, rd1: 71, rd2: 73, rd3: 72, rd4: 76, strokes: 292, total: 4, index: 49, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cd6", name: "Cameron Smith", thru: 0, round: 3, rd1: 70, rd2: 72, rd3: 75, rd4: 75, strokes: 292, total: 4, index: 4, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cd7", name: "Zach Johnson", thru: 0, round: 1, rd1: 75, rd2: 70, rd3: 74, rd4: 73, strokes: 292, total: 4, index: 52, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cd8", name: "Talor Gooch", thru: 0, round: 1, rd1: 72, rd2: 74, rd3: 73, rd4: 73, strokes: 292, total: 4, index: 43, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cd9", name: "J.T. Poston", thru: 0, round: -2, rd1: 74, rd2: 72, rd3: 76, rd4: 70, strokes: 292, total: 4, index: 15, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cda", name: "Taylor Moore", thru: 0, round: 6, rd1: 73, rd2: 72, rd3: 70, rd4: 78, strokes: 293, total: 5, index: 44, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cdb", name: "Abraham Ancer", thru: 0, round: 4, rd1: 72, rd2: 71, rd3: 74, rd4: 76, strokes: 293, total: 5, index: 0, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cdc", name: "Adam Scott", thru: 0, round: 2, rd1: 68, rd2: 74, rd3: 77, rd4: 74, strokes: 293, total: 5, index: 1, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cdd", name: "Jason Day", thru: 0, round: 8, rd1: 67, rd2: 72, rd3: 74, rd4: 80, strokes: 293, total: 5, index: 16, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cde", name: "Max Homa", thru: 0, round: 6, rd1: 71, rd2: 73, rd3: 72, rd4: 78, strokes: 294, total: 6, index: 26, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15cdf", name: "Harris English", thru: 0, round: 3, rd1: 71, rd2: 71, rd3: 77, rd4: 75, strokes: 294, total: 6, index: 13, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ce0", name: "Mito Pereira", thru: 0, round: 1, rd1: 74, rd2: 70, rd3: 77, rd4: 73, strokes: 294, total: 6, index: 27, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ce1", name: "Sepp Straka", thru: 0, round: 6, rd1: 70, rd2: 73, rd3: 74, rd4: 78, strokes: 295, total: 7, index: 39, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ce2", name: "Seamus Power", thru: 0, round: 5, rd1: 73, rd2: 72, rd3: 73, rd4: 77, strokes: 295, total: 7, index: 38, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ce3", name: "Thomas Pieters", thru: 0, round: 5, rd1: 74, rd2: 73, rd3: 72, rd4: 77, strokes: 296, total: 8, index: 45, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ce4", name: "Dustin Johnson", thru: 0, round: 3, rd1: 71, rd2: 72, rd3: 78, rd4: 75, strokes: 296, total: 8, index: 9, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ce5", name: "Charl Schwartzel", thru: 0, round: 5, rd1: 74, rd2: 73, rd3: 73, rd4: 77, strokes: 297, total: 9, index: 6, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ce6", name: "Fred Couples", thru: 0, round: 4, rd1: 71, rd2: 74, rd3: 76, rd4: 76, strokes: 297, total: 9, index: 10, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ce7", name: "Billy Horschel", thru: 0, round: 7, rd1: 73, rd2: 74, rd3: 74, rd4: 79, strokes: 300, total: 12, index: 2, year: 2023, tournament: "masters" },
    { _id: "6632d49713dbce1a8cf15ce8", name: "Keith Mitchell", thru: 0, round: 7, rd1: 75, rd2: 71, rd3: 77, rd4: 79, strokes: 302, total: 14, index: 23, year: 2023, tournament: "masters" },
];

describe("evaluateTeamAndAlternate", () => {
    it("generates the expected teams", () => {
        expect(evaluateTeamAndAlternate(302128659, 52364573, 303956490, 151196447)).toEqual([
            [18, 2, 19, 3],
            [30, 10, 9, 31],
        ]);
    });
});

describe("getTeamScore", () => {
    it("calculate the score based on some team", () => {
        expect(getTeamScore(303956755, tourney, 72)).toBe(-35);
    });
});

describe("scoreFromGolfer", () => {
    it("calculate each golfer score by index", () => {
        expect(scoreFromGolfer(18, tourney, 72)).toBe(276);
    });
});
describe("test daus vs chadlike", () => {
    const daus = {
        public_id: 222,
        players: 303956490,
        alternates: 151196447,
        oppie: 5,
    };

    const chad = {
        public_id: 5,
        players: 302128659,
        alternates: 52364573,
        oppie: 222,
    };

    it("will have 4 numbers, 2 first teams and 2 alternates", () => {
        expect(partition(302128659)).toEqual([18, 2, 30, 19]);
        expect(partition(52364573)).toEqual([3, 31, 5, 29]);
        expect(partition(303956490)).toEqual([18, 30, 2, 10]);
        expect(partition(151196447)).toEqual([9, 3, 19, 31]);

        expect(determineOrderAndEvaluate(chad, daus)).toEqual({ user: [18, 2, 19, 3], opp: [30, 10, 9, 31] });

        expect(getTeamScore(coerce(...[18, 2, 19, 3]), tourney, 72)).toBe(-15);
        expect(getTeamScore(coerce(...[30, 10, 9, 31]), tourney, 72)).toBe(2);
    });
});
