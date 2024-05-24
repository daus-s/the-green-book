const calculateTimeLeft = (cuttime) => {
    const cutdate = new Date(cuttime);
    const difference = +cutdate - +new Date();
    if (difference > 0) {
        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60),
            open: true,
        };
    } else {
        return {
            days: "-",
            hours: "-",
            minutes: "-",
            seconds: "-",
            open: false,
        };
    }
};

module.exports = { calculateTimeLeft };
