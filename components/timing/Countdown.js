import React, { useState, useEffect } from "react";

export default function Countdown({ initialMinutes = 10 }) {
    const [time, setTime] = useState(initialMinutes * 60);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prevTime) => {
                if (prevTime <= 0) {
                    clearInterval(timer);
                    alert("Time’s up!");
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval on component unmount
    }, []);

    const formatTime = () => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };

    return <div className="timer">{formatTime()}</div>;
}
