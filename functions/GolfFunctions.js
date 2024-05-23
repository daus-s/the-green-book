const { allButThis } = require("./AllButThisJSON");
const { partition } = require("./RandomBigInt");

function figureOutCurrentRound(data) {
    let rd1 = typeof data.rd1 === "number";
    let rd2 = typeof data.rd2 === "number";
    let rd3 = typeof data.rd3 === "number";
    let rd4 = typeof data.rd4 === "number";

    if (!rd1) return 0;
    if (rd1 && !rd2) return 1;
    if (rd2 && !rd3) return 2;
    if (rd3 && !rd4) return 3;
    if (rd4) return 4; //end
    return 0;
}
/**
 * the number i is the number of score of the current round
 * @param {number} i
 * @returns
 */
function goodness(i) {
    if (typeof i != "number") {
        return {};
    }
    if (i > 10) {
        return { backgroundColor: "var(--golf-trash)" };
    }
    if (i > 5 && i <= 10) {
        return { backgroundColor: "var(--golf-bad)" };
    }
    if (i >= 0 && i <= 5) {
        return { backgroundColor: "var(--golf-mid)" };
    }
    if (i >= -5 && i < 0) {
        return { backgroundColor: "var(--golf-good)" };
    }
    if (i < -5) {
        return { backgroundColor: "var(--golf-great)" };
    }
}

function goodnessStr(i) {
    if (typeof i != "number") {
        return;
    }
    if (i > 10) {
        return "var(--golf-trash)";
    }
    if (i > 5 && i <= 10) {
        return "var(--golf-bad)";
    }
    if (i >= 0 && i <= 5) {
        return "var(--golf-mid)";
    }
    if (i >= -5 && i < 0) {
        return "var(--golf-good)";
    }
    if (i < -5) {
        return "var(--golf-great)";
    }
}

/**
 * returns whether a number is an integer (including 0)
 * @param {number} i
 * @returns
 */
function exists(i) {
    return typeof i === "number" && i === Math.floor(i);
}

function getGolferProjection(p, par) {
    if (typeof par === "undefined" || typeof par !== "number") {
        const par = 72;
    }
    let rds = [p?.rd1, p?.rd2, p?.rd3, p?.rd4];
    let score = 0;
    let count = 0;
    let x = true;
    while (x && count < rds.length) {
        x = exists(rds[count]);
        score += x ? rds[count] : 0;
        count += x ? 1 : 0;
    }
    return score - par * count * (4 / count);
}

function getTeamProjection(p1, p2, p3, p4) {
    return getGolferProjection(p1) + getGolferProjection(p2) + getGolferProjection(p3) + getGolferProjection(p4);
}

function scoreFromGolfer(index, golfers) {
    if (!Array.isArray(golfers)) {
        throw Error("golfers must be an array of json like objects schema...");
    }
    for (let i = 0; i < golfers.length; ++i) {
        const golfer = golfers[i];
        if (golfer?.index === index) {
            return golfer?.rd1 + golfer?.rd2 + golfer?.rd3 + golfer?.rd4;
        }
    }
    throw Error("the golfer doesnt exist in the set provided"); // the golfer doesnt exist in the data set provided, maybe i should throw here
}
//TESTIES
/**
 *
 * @param {number} final
 * @param {JSON} golfers
 * @returns
 */
function getTeamScore(final, golfers, par) {
    console.log(golfers);
    if (!final || !golfers) {
        throw Error("no data provided");
    }
    const gs = partition(final);
    //we have our indices
    let score = 0;
    for (let i = 0; i < gs.length; ++i) {
        try {
            // console.log(gs[i], scoreFromGolfer(gs[i], tourney))
            score += scoreFromGolfer(gs[i], golfers);
        } catch (Error) {
            score += 0; //do i want to add zero?
        }
    }
    return score - 16 * par; // factor for 4 golfers,
}
/**
 *
 * @param {number} players1
 * @param {number} alternates1
 * @param {number} players2
 * @param {number} alternates2
 * @returns
 */
function evaluateTeamAndAlternate(players1, alternates1, players2, alternates2) {
    let queue1 = [].concat(partition(players1).concat(partition(alternates1))).reverse(); //this is now a list i do this so it is easier to see functions
    let queue2 = [].concat(partition(players2).concat(partition(alternates2))).reverse(); //now the first players are on the back of the list

    const cut1 = [];
    const cut2 = [];
    for (let turn = 0; turn < 8; ++turn) {
        //pick players
        if (turn % 2) {
            //second's picks
            const player = queue2.pop();
            cut2.push(player);
            queue1 = allButThis(queue1, player);
            queue2 = allButThis(queue2, player);
        } else {
            //first's picks
            const player = queue1.pop();
            cut1.push(player);
            queue1 = allButThis(queue1, player);
            queue2 = allButThis(queue2, player);
        }
    }
    return [cut1, cut2];
}

//i think this function does too much.
//it should take 2 GOLFBet objects and calculate from there.
//just like it has the toruney data passed in -- removing the dependency on supabase
function determineOrderAndEvaluate(fv, tb) {
    //fv is your picks
    //tb is opp picks
    if (!fv || !tb) {
        throw Error("missing at least one bet from calling this");
    }
    if (fv.public_id !== tb.oppie || fv.oppie !== tb.public_id) {
        throw Error("mismatched bets. try again h8r.");
    }

    let user, opp;
    if (fv.public_id < fv.oppie) {
        [user, opp] = evaluateTeamAndAlternate(...[fv.players, fv.alternates], ...[tb.players, tb.alternates]);
    } else if (fv.public_id > fv.oppie) {
        [user, opp] = evaluateTeamAndAlternate(...[tb.players, tb.alternates], ...[fv.players, fv.alternates]);
    } else {
        throw Error("the player is playing themselves?");
    }
    return { user: user, opp: opp };
}

function getOrderOfBrackets(brackets, tourney, par) {
    // console.log(brackets);
    const list = [];
    for (const bracket of brackets) {
        const score = getTeamScore(bracket.players, tourney, par);
        list.push({ user: bracket.public_id, score: score });
    }
    list.sort((a, b) => a.score - b.score);
    return list;
}

function getPosition(userID, league, tourney, par) {
    const scoredBrackets = getOrderOfBrackets(league, tourney, par);
    for (let i = 0; i < scoredBrackets.length; ++i) {
        if (userID === scoredBrackets[i].user) {
            return i + 1;
        }
    }
    return -1;
}

function golferViaIndex(index, tourney) {
    if (typeof index !== "number" || isNaN(index)) {
        throw Error("index is not a valid number");
    }
    if (Array.isArray(tourney)) {
        if (0 > index || index >= tourney.length) {
            throw Error("index out of bounds");
        }
        for (const g of tourney) {
            if (g.index === index) {
                return g;
            }
        }
    } else {
        throw Error("tournament is extinct");
    }
    throw Error("golfer is extinct");
}

function parse(data, pos) {
    console.log(data);
    if (data.bet?.alternates && data.bet?.players) {
        switch (pos) {
            case "p1":
                return partition(data.bet.players)[0];
            case "p2":
                return partition(data.bet.players)[1];
            case "p3":
                return partition(data.bet.players)[2];
            case "p4":
                return partition(data.bet.players)[3];
            case "alt1":
                return partition(data.bet.alternates)[0];
            case "alt2":
                return partition(data.bet.alternates)[1];
            case "alt3":
                return partition(data.bet.alternates)[2];
            case "alt4":
                return partition(data.bet.alternates)[3];
            default:
                return undefined;
        }
    } else if (data.bet?.players) {
        switch (pos) {
            case "p1":
                return partition(data.bet.players)[0];
            case "p2":
                return partition(data.bet.players)[1];
            case "p3":
                return partition(data.bet.players)[2];
            case "p4":
                return partition(data.bet.players)[3];
            default:
                return undefined;
        }
    }
}

function golfer(data, pos, tournament) {
    console.log(" *********************************\n * TOURNAMENT ********************\n *********************************\n", tournament);
    return golferViaIndex(parse(data, pos), tournament);
}

module.exports = {
    figureOutCurrentRound,
    goodness,
    goodnessStr,
    getGolferProjection,
    getTeamProjection,
    scoreFromGolfer,
    getTeamScore,
    evaluateTeamAndAlternate,
    determineOrderAndEvaluate,
    getOrderOfBrackets,
    getPosition,
    golferViaIndex,
    parse,
    golfer,
};
