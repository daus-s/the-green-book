//www.digitalocean.com/community/tutorials/react-countdown-timer-react-hooks

import { useEffect, useState } from "react";
import { calculateTimeLeft } from "../functions/Timer";

export default function Timer({ cutTime }) {
    if (!cutTime) {
        return <></>;
    }
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(cutTime));

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft(cutTime));
        }, 1000);
        return () => clearTimeout(timer);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (interval === "open") {
            return;
        }
        if ((!timeLeft[interval] && timeLeft[interval] !== 0) || (timeLeft[interval] === 0 && interval === "days")) {
            return;
        }

        timerComponents.push(
            <div className="time">
                {timeLeft[interval]} <div className="unit">{interval}</div>
            </div>
        );
    });

    if (timeLeft?.open === false) {
        return (
            <div className="timer">
                <div className="clsd-sts-msg">Bets are closed</div>
            </div>
        );
    } else if (timeLeft?.open === true) {
        return (
            <div className="timer">
                <div>Bets close in</div>
                <div className="time-units">{timerComponents}</div>
            </div>
        );
    } else {
        return <></>;
    }
}
