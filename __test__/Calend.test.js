const { isLeapYear, calculateDayOfWeek, daysSinceZero } = require("../functions/Calend.js");

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

describe("TEST: isLeapYear", () => {
    it("tells you what is leap year", () => {
        expect(isLeapYear(2008)).toBe(true);
        expect(isLeapYear(2004)).toBe(true);
        expect(isLeapYear(1200)).toBe(true);
        expect(isLeapYear(2000)).toBe(true);
        expect(isLeapYear(0)).toBe(true);
    });

    it("tells you what isnt leap year", () => {
        expect(isLeapYear(2007)).toBe(false);
        expect(isLeapYear(2005)).toBe(false);
        expect(isLeapYear(1)).toBe(false);
        expect(isLeapYear(1000)).toBe(false);
        expect(isLeapYear(1900)).toBe(false);
        expect(isLeapYear(40001)).toBe(false);
        expect(isLeapYear(69)).toBe(false);
        expect(isLeapYear(1)).toBe(false);
    });

    it("tells you about leap years since epoch.", () => {
        expect(isLeapYear(1970)).toBe(false);
        expect(isLeapYear(1971)).toBe(false);
        expect(isLeapYear(1972)).toBe(true);
        expect(isLeapYear(1973)).toBe(false);
        expect(isLeapYear(1974)).toBe(false);
        expect(isLeapYear(1975)).toBe(false);
        expect(isLeapYear(1976)).toBe(true);
        expect(isLeapYear(1977)).toBe(false);
        expect(isLeapYear(1978)).toBe(false);
        expect(isLeapYear(1979)).toBe(false);
        expect(isLeapYear(1980)).toBe(true);
        expect(isLeapYear(1981)).toBe(false);
        expect(isLeapYear(1982)).toBe(false);
        expect(isLeapYear(1983)).toBe(false);
        expect(isLeapYear(1984)).toBe(true);
        expect(isLeapYear(1985)).toBe(false);
        expect(isLeapYear(1986)).toBe(false);
        expect(isLeapYear(1987)).toBe(false);
        expect(isLeapYear(1988)).toBe(true);
        expect(isLeapYear(1989)).toBe(false);
        expect(isLeapYear(1990)).toBe(false);
        expect(isLeapYear(1991)).toBe(false);
        expect(isLeapYear(1992)).toBe(true);
        expect(isLeapYear(1993)).toBe(false);
        expect(isLeapYear(1994)).toBe(false);
        expect(isLeapYear(1995)).toBe(false);
        expect(isLeapYear(1996)).toBe(true);
        expect(isLeapYear(1997)).toBe(false);
        expect(isLeapYear(1998)).toBe(false);
        expect(isLeapYear(1999)).toBe(false);
        expect(isLeapYear(2000)).toBe(true);
        expect(isLeapYear(2001)).toBe(false);
        expect(isLeapYear(2002)).toBe(false);
        expect(isLeapYear(2003)).toBe(false);
        expect(isLeapYear(2004)).toBe(true);
        expect(isLeapYear(2005)).toBe(false);
        expect(isLeapYear(2006)).toBe(false);
        expect(isLeapYear(2007)).toBe(false);
        expect(isLeapYear(2008)).toBe(true);
        expect(isLeapYear(2009)).toBe(false);
        expect(isLeapYear(2010)).toBe(false);
        expect(isLeapYear(2011)).toBe(false);
        expect(isLeapYear(2012)).toBe(true);
        expect(isLeapYear(2013)).toBe(false);
        expect(isLeapYear(2014)).toBe(false);
        expect(isLeapYear(2015)).toBe(false);
        expect(isLeapYear(2016)).toBe(true);
        expect(isLeapYear(2017)).toBe(false);
        expect(isLeapYear(2018)).toBe(false);
        expect(isLeapYear(2019)).toBe(false);
        expect(isLeapYear(2020)).toBe(true);
        expect(isLeapYear(2021)).toBe(false);
        expect(isLeapYear(2022)).toBe(false);
        expect(isLeapYear(2023)).toBe(false);
        expect(isLeapYear(2024)).toBe(true);
        expect(isLeapYear(2025)).toBe(false);
    });
});

describe("TEST: calculateDayOfWeek", () => {
    const THURSDAY = 0;
    const FRIDAY = 1;
    const SATURDAY = 2;
    const SUNDAY = 3;
    const MONDAY = 4;
    const TUESDAY = 5;
    const WEDNESDAY = 6;

    it("tells you the days of next week", () => {
        expect(calculateDayOfWeek(24, OCTOBER, 2024)).toBe(THURSDAY);
        expect(calculateDayOfWeek(25, OCTOBER, 2024)).toBe(FRIDAY);
        expect(calculateDayOfWeek(26, OCTOBER, 2024)).toBe(SATURDAY);
        expect(calculateDayOfWeek(27, OCTOBER, 2024)).toBe(SUNDAY);
        expect(calculateDayOfWeek(28, OCTOBER, 2024)).toBe(MONDAY);
        expect(calculateDayOfWeek(29, OCTOBER, 2024)).toBe(TUESDAY);
        expect(calculateDayOfWeek(30, OCTOBER, 2024)).toBe(WEDNESDAY);
    });

    it("works when weeks go over months", () => {
        expect(calculateDayOfWeek(31, OCTOBER, 2024)).toBe(THURSDAY);
        expect(calculateDayOfWeek(1, NOVEMBER, 2024)).toBe(FRIDAY);
        expect(calculateDayOfWeek(2, NOVEMBER, 2024)).toBe(SATURDAY);
        expect(calculateDayOfWeek(3, NOVEMBER, 2024)).toBe(SUNDAY);
        expect(calculateDayOfWeek(4, NOVEMBER, 2024)).toBe(MONDAY);
        expect(calculateDayOfWeek(5, NOVEMBER, 2024)).toBe(TUESDAY);
        expect(calculateDayOfWeek(6, NOVEMBER, 2024)).toBe(WEDNESDAY);
    });

    it("works on random dates in history", () => {
        expect(calculateDayOfWeek(22, OCTOBER, 2024)).toBe(TUESDAY);
        expect(calculateDayOfWeek(11, SEPTEMBER, 2001)).toBe(TUESDAY);
        expect(calculateDayOfWeek(1, JANUARY, 1970)).toBe(THURSDAY);
    });

    it("genesis 1:1", () => {
        expect(daysSinceZero(1, JANUARY, 1970)).toBe(THURSDAY);
        expect(daysSinceZero(2, JANUARY, 1970)).toBe(FRIDAY);
        expect(daysSinceZero(3, JANUARY, 1970)).toBe(SATURDAY);
        expect(daysSinceZero(4, JANUARY, 1970)).toBe(SUNDAY);
        expect(daysSinceZero(5, JANUARY, 1970)).toBe(MONDAY);
        expect(daysSinceZero(6, JANUARY, 1970)).toBe(TUESDAY);
        expect(daysSinceZero(7, JANUARY, 1970)).toBe(WEDNESDAY);
    });

    it("year 1, week 1", () => {
        expect(calculateDayOfWeek(1, JANUARY, 1971)).toBe(FRIDAY);
        expect(calculateDayOfWeek(2, JANUARY, 1971)).toBe(SATURDAY);
        expect(calculateDayOfWeek(3, JANUARY, 1971)).toBe(SUNDAY);
        expect(calculateDayOfWeek(4, JANUARY, 1971)).toBe(MONDAY);
        expect(calculateDayOfWeek(5, JANUARY, 1971)).toBe(TUESDAY);
        expect(calculateDayOfWeek(6, JANUARY, 1971)).toBe(WEDNESDAY);
        expect(calculateDayOfWeek(7, JANUARY, 1971)).toBe(THURSDAY);
    });

    it("year 3, week 1", () => {
        expect(calculateDayOfWeek(1, JANUARY, 1972)).toBe(SATURDAY);
        expect(calculateDayOfWeek(2, JANUARY, 1972)).toBe(SUNDAY);
        expect(calculateDayOfWeek(3, JANUARY, 1972)).toBe(MONDAY);
        expect(calculateDayOfWeek(4, JANUARY, 1972)).toBe(TUESDAY);
        expect(calculateDayOfWeek(5, JANUARY, 1972)).toBe(WEDNESDAY);
        expect(calculateDayOfWeek(6, JANUARY, 1972)).toBe(THURSDAY);
        expect(calculateDayOfWeek(7, JANUARY, 1972)).toBe(FRIDAY);
    });

    it("after first leap year", () => {
        expect(calculateDayOfWeek(1, MARCH, 1972)).toBe(WEDNESDAY);
        expect(calculateDayOfWeek(2, MARCH, 1972)).toBe(THURSDAY);
        expect(calculateDayOfWeek(3, MARCH, 1972)).toBe(FRIDAY);
        expect(calculateDayOfWeek(4, MARCH, 1972)).toBe(SATURDAY);
        expect(calculateDayOfWeek(5, MARCH, 1972)).toBe(SUNDAY);
        expect(calculateDayOfWeek(6, MARCH, 1972)).toBe(MONDAY);
        expect(calculateDayOfWeek(7, MARCH, 1972)).toBe(TUESDAY);
    });
});

describe("TEST: daysSinceZero", () => {
    it("genesis 1:1", () => {
        expect(daysSinceZero(1, JANUARY, 1970)).toBe(0);
        expect(daysSinceZero(2, JANUARY, 1970)).toBe(1);
        expect(daysSinceZero(3, JANUARY, 1970)).toBe(2);
        expect(daysSinceZero(4, JANUARY, 1970)).toBe(3);
        expect(daysSinceZero(5, JANUARY, 1970)).toBe(4);
        expect(daysSinceZero(6, JANUARY, 1970)).toBe(5);
        expect(daysSinceZero(7, JANUARY, 1970)).toBe(6);
    });

    it("after first leap year", () => {
        expect(daysSinceZero(1, MARCH, 1972)).toBe(790);
        expect(daysSinceZero(2, MARCH, 1972)).toBe(791);
        expect(daysSinceZero(3, MARCH, 1972)).toBe(792);
        expect(daysSinceZero(4, MARCH, 1972)).toBe(793);
        expect(daysSinceZero(5, MARCH, 1972)).toBe(794);
        expect(daysSinceZero(6, MARCH, 1972)).toBe(795);
        expect(daysSinceZero(7, MARCH, 1972)).toBe(796);
    });

    it("tells random days in history", () => {
        expect(daysSinceZero(1, JANUARY, 1970)).toBe(0);
        expect(daysSinceZero(1, FEBRUARY, 1970)).toBe(Math.floor(2727733 / 86400));
        expect(daysSinceZero(1, MARCH, 1970)).toBe(Math.floor(5146933 / 86400));
        expect(daysSinceZero(22, OCTOBER, 2024)).toBe(20018);
    });

    it("breaks in february of 1970", () => {
        expect(daysSinceZero(1, FEBRUARY, 1970)).toBe(31);
        expect(daysSinceZero(2, FEBRUARY, 1970)).toBe(32);
        expect(daysSinceZero(3, FEBRUARY, 1970)).toBe(33);
        expect(daysSinceZero(4, FEBRUARY, 1970)).toBe(34);
        expect(daysSinceZero(5, FEBRUARY, 1970)).toBe(35);
        expect(daysSinceZero(6, FEBRUARY, 1970)).toBe(36);
        expect(daysSinceZero(7, FEBRUARY, 1970)).toBe(37);
        expect(daysSinceZero(8, FEBRUARY, 1970)).toBe(38);
        expect(daysSinceZero(9, FEBRUARY, 1970)).toBe(39);
        expect(daysSinceZero(10, FEBRUARY, 1970)).toBe(40);
        expect(daysSinceZero(11, FEBRUARY, 1970)).toBe(41);
        expect(daysSinceZero(12, FEBRUARY, 1970)).toBe(42);
        expect(daysSinceZero(13, FEBRUARY, 1970)).toBe(43);
        expect(daysSinceZero(14, FEBRUARY, 1970)).toBe(44);
        expect(daysSinceZero(15, FEBRUARY, 1970)).toBe(45);
        expect(daysSinceZero(16, FEBRUARY, 1970)).toBe(46);
        expect(daysSinceZero(17, FEBRUARY, 1970)).toBe(47);
        expect(daysSinceZero(18, FEBRUARY, 1970)).toBe(48);
        expect(daysSinceZero(19, FEBRUARY, 1970)).toBe(49);
        expect(daysSinceZero(20, FEBRUARY, 1970)).toBe(50);
        expect(daysSinceZero(21, FEBRUARY, 1970)).toBe(51);
        expect(daysSinceZero(22, FEBRUARY, 1970)).toBe(52);
        expect(daysSinceZero(23, FEBRUARY, 1970)).toBe(53);
        expect(daysSinceZero(24, FEBRUARY, 1970)).toBe(54);
        expect(daysSinceZero(25, FEBRUARY, 1970)).toBe(55);
        expect(daysSinceZero(26, FEBRUARY, 1970)).toBe(56);
        expect(daysSinceZero(27, FEBRUARY, 1970)).toBe(57);
        expect(daysSinceZero(28, FEBRUARY, 1970)).toBe(58);
    });

    const daysSinceEpoch = () => {
        return Math.floor(Date.now() / 86_400_000);
    };
    it("tests agianst daysSinceEpoch with unix timestamp", () => {
        const today = new Date();
        expect(daysSinceZero(today.getUTCDate(), today.getUTCMonth(), today.getUTCFullYear())).toBe(daysSinceEpoch());
    });
});
