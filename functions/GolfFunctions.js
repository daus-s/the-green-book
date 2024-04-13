function figureOutCurrentRound(data) {
    let rd1 = typeof data.rd1 === 'number';
    let rd2 = typeof data.rd2 === 'number';
    let rd3 = typeof data.rd3 === 'number';
    let rd4 = typeof data.rd4 === 'number';

    if (!rd1)
        return 0;
    if (rd1 && !rd2)
        return 1;
    if (rd2 && !rd3)
        return 2;
    if (rd3 && !rd4)
        return 3;
    if (rd4)
        return 4; //end
    return 0;
}
/* 
  --golf-trash: #dd1010;
  --golf-bad: #c05454;
  --golf-mid: #8a8a8a;
  --golf-good: #54c054;
  --golf-great: #148b14;
*/
/**
 * the number i is the number of score of the current round
 * @param {number} i 
 * @returns 
 */
function goodness(i) {
    if (typeof i != 'number') {
        return {}
    }
    if (i > 10) {
        return {backgroundColor: 'var(--golf-trash)'}
    }
    if (i > 5 && i <= 10) {
        return {backgroundColor: 'var(--golf-bad)'}
    }
    if (i >= 0 && i <= 5) {
        return {backgroundColor: 'var(--golf-mid)'}
    }
    if (i >= -5 && i < 0) {
        return {backgroundColor: 'var(--golf-good)'}
    }
    if (i < -5) {
        return {backgroundColor: 'var(--golf-great)'}
    }
}

function goodnessStr(i) {
    if (typeof i != 'number') {
        return;
    }
    if (i > 10) {
        return 'var(--golf-trash)';
    }
    if (i > 5 && i <= 10) {
        return 'var(--golf-bad)';
    }
    if (i >= 0 && i <= 5) {
        return 'var(--golf-mid)';
    }
    if (i >= -5 && i < 0) {
        return 'var(--golf-good)';
    }
    if (i < -5) {
        return 'var(--golf-great)';
    }
}

/**
 * returns whether a number is an integer (including 0)
 * @param {number} i 
 * @returns 
 */
function exists(i) {
    return typeof i === 'number' && i===Math.floor(i)
}

function getGolferProjection(p) {
    let rds = [p?.rd1, p?.rd2, p?.rd3, p?.rd4];
    let score = 0;
    let count = 0;
    let x = true
    while (x&&count<rds.length) {
        x = exists(rds[count])
        score += x?rds[count]:0;
        count += x?1:0;
    }
    
    return (score - (72*count) * (4/count));
}

function getTeamProjection(p1, p2, p3, p4) {
    return getGolferProjection(p1)+getGolferProjection(p2)+getGolferProjection(p3)+getGolferProjection(p4)
}

module.exports = { figureOutCurrentRound, goodness, goodnessStr, getGolferProjection, getTeamProjection }