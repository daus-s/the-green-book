import { isTomorrow } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Calendar from "react-calendar";

export default function DateTimePicker({ time, setTime }) {
    if (!(new Date(time) && typeof setTime === "function")) {
        throw new Error("invalid state management and parameter");
    }
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isOpen && ref.current && !ref.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isOpen]);

    return (
        <div style={{ position: "relative" }}>
            {isOpen ? <DTModal time={time} setTime={setTime} ref={ref} /> : <></>}
            <FieldIcon time={time} setIsOpen={setIsOpen} />
        </div>
    );
}

const DTModal = React.forwardRef(function DTModal({ time, setTime }, ref) {
    const format = (_locale, date) => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][date.getUTCDay()];
    return (
        <div className="date-time-modal" style={{ position: "absolute" }} ref={ref}>
            <Calendar value={time} onChange={setTime} formatShortWeekday={format} />
            <TimeSelect />
        </div>
    );
});

function TimeSelect() {
    return;
}

function FieldIcon({ time, setIsOpen }) {
    const h = time.getHours();
    const m = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    return (
        <div className="date-time-icon">
            {isTomorrow(time)
                ? "Tomorrow, " + (h % 12 === 0 ? 12 : h % 12) + ":" + m + (h > 12 ? "PM" : "AM")
                : time.getMonth() + 1 + "/" + time.getDate() + "/" + time.getFullYear() + " " + (h % 12 === 0 ? 12 : h % 12) + ":" + m + (h > 12 ? "PM" : "AM")}
            <div className="img-hover-wrapper">
                <Image
                    src="/calendar.png"
                    alt={"Pick date and time to finalize bet."}
                    height={24}
                    width={24}
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsOpen(true);
                    }}
                />
            </div>
        </div>
    );
}
