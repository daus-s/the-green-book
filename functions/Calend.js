const JANUARY = 0;
const FEBRUARY = 1;
const MARCH = 2;
const APRIL = 3;
const MAY = 4;
const JUNE = 5;
const JULY = 6;
const AUGUST = 7;
const SEPTEMBER = 8;
const OCTOBER = 9;
const NOVEMBER = 10;
const DECEMBER = 11;

//day 0 is jan 1 1970. i promise it makes more sense

/**
 *
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @returns the number of the day of the week.
 *
 */
function daysSinceZero(day, month, year) {
    let daysSinceZero = 0;
    for (let i = 1970; i < year; i++) {
        if (isLeapYear(i)) {
            daysSinceZero += 366;
        } else {
            daysSinceZero += 365;
        }
    }

    for (let i = 0; i < month; i++) {
        if ([JANUARY, MARCH, MAY, JULY, AUGUST, OCTOBER, DECEMBER].includes(i)) {
            daysSinceZero += 31;
        } else if ([APRIL, JUNE, SEPTEMBER, NOVEMBER].includes(i)) {
            daysSinceZero += 30;
        } else if ([FEBRUARY].includes(i)) {
            if (isLeapYear(year)) {
                daysSinceZero += 29;
            } else {
                daysSinceZero += 28;
            }
        }
    }

    daysSinceZero += day - 1;

    return daysSinceZero;
}

/**
 *
 * @param {number} day
 * @param {number} month
 * @param {number} year
 * @returns the number of the day of the week.
 * KEY:
 *    •	THURSDAY = 0
 *    •	THURSDAY = 1
 *    •	THURSDAY = 2
 *    •	THURSDAY = 3
 *    •	THURSDAY = 4
 *    •	THURSDAY = 5
 *    •	THURSDAY = 6
 *
 * you might notice there are only 6 days. this is correct.
 *
 * if you dont think so think about
 * the range of our final operation in the function
 *
 */
function calculateDayOfWeek(day, month, year) {
    return daysSinceZero(day, month, year) % 7;
}

function generateDates(month, year) {
    let length = 0;

    //detemine length of the month
    if ([FEBRUARY].includes(month)) {
        if (isLeapYear(year)) {
            length = 29;
        } else {
            length = 28;
        }
    } else {
        if ([JANUARY, MARCH, MAY, JULY, AUGUST, OCTOBER, DECEMBER].includes(month)) {
            length = 31;
        } else if ([APRIL, JUNE, SEPTEMBER, NOVEMBER].includes(month)) {
            length = 30;
        }
    }

    const dates = [];
    const week = 0;
    for (let i = 0; i < length; ++i) {
        dates.push({ display: i + 1, dow: calculateDayOfWeek(i, month, year), basetime: daysSinceZero(i, month, year) * 86_400_000 });
    }
    return dates;
}

function isLeapYear(year) {
    if (year % 4 !== 0) {
        return false;
    }

    if (year % 100 === 0 && year % 400 !== 0) {
        return false;
    }

    return true;
}

module.exports = { generateDates, isLeapYear, calculateDayOfWeek, daysSinceZero };
