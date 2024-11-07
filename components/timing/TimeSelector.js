import { isTomorrow } from "date-fns";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Calendar from "react-calendar";

export default function DateTimePicker({ time, setTime }) {
    if (!(new Date(time) && typeof setTime === "function")) {
        throw new Error("invalid state management and parameter");
    }
    const [isDateOpen, setIsDateOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);

    const refD = useRef(null);
    const refT = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDateOpen && refD.current && !refD.current.contains(event.target)) {
                setIsDateOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isDateOpen]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isTimeOpen && refT.current && !refT.current.contains(event.target)) {
                setIsTimeOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [isTimeOpen]);

    return (
        <div style={{ position: "relative" }}>
            {isDateOpen ? <DModal time={time} setTime={setTime} ref={refD} /> : <></>}
            {isTimeOpen ? <TModal time={time} setTime={setTime} ref={refT} /> : <></>}
            <DateTimeDisplay time={time} setIsDateOpen={setIsDateOpen} setIsTimeOpen={setIsTimeOpen} />
        </div>
    );
}

const DModal = React.forwardRef(function DTModal({ time, setTime }, ref) {
    const format = (_locale, date) => ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"][date.getUTCDay()];
    return (
        <div className="date-time-modal date" style={{ position: "absolute" }} ref={ref}>
            <Calendar value={time} onChange={setTime} formatShortWeekday={format} />
        </div>
    );
});

//TODO: continue improving this function to support time selection
const TModal = React.forwardRef(function DTModal({ time, setTime }, ref) {
    const [hour, setHour] = useState((time.getHours() % 12) + 1);
    const [minute, setMinute] = useState(time.getMinutes());
    const [period, setPeriod] = useState(time.getHours() > 12 ? "PM" : "AM");

    const complexHourSetter = () => {};

    return (
        <div className="date-time-modal time" style={{ position: "absolute" }} ref={ref}>
            <div className="time-picker-header">Select Time</div>

            <div className="time-selectors">
                {/* Hour Selector */}
                <div className="hour">
                    <select name="hour" aria-label="Select hour" value={hour} onChange={setTime}>
                        {[...Array(12)].map((_, index) => (
                            <option key={index} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </select>
                </div>

                {/* <span>:</span> */}

                {/* Minute Selector */}
                <div className="minute">
                    <select name="minute" aria-label="Select minute">
                        {[0, 15, 30, 45].map((minute) => (
                            <option key={minute} value={minute}>
                                {minute.toString().padStart(2, "0")}
                            </option>
                        ))}
                    </select>
                </div>

                {/* AM/PM Selector */}
                <div className="period">
                    <select name="period" aria-label="Select AM or PM">
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
            </div>
        </div>
    );
});

function DateTimeDisplay({ time, setIsDateOpen, setIsTimeOpen }) {
    const h = time.getHours();
    const m = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    return (
        <div className="date-time-icon">
            {isTomorrow(time)
                ? "Tomorrow, " + (h % 12 === 0 ? 12 : h % 12) + ":" + m + (h > 12 ? "PM" : "AM")
                : time.getMonth() + 1 + "/" + time.getDate() + "/" + time.getFullYear() + " " + (h % 12 === 0 ? 12 : h % 12) + ":" + m + (h > 12 ? "PM" : "AM")}
            <FieldIcon src="/calendar.png" alt="Pick a date to finalize bet." setIsOpen={setIsDateOpen} style={{ padding: "5px" }} />
            <FieldIcon src="/clock.png" alt="Pick a time to finalize bet." setIsOpen={setIsTimeOpen} style={{ padding: "5px" }} />
        </div>

        /* im gonna do the same thing but for clock to select time  */
    );
}

function FieldIcon({ src, alt, setIsOpen, style, imgStyle }) {
    return (
        <div className="img-hover-wrapper" style={style}>
            <Image
                src={src}
                alt={alt}
                height={22}
                width={22}
                onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(true);
                }}
                style={imgStyle}
            />
        </div>
    );
}
