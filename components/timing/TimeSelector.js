import { isTomorrow } from "date-fns";
import Image from "next/image";
import { useState } from "react";
import Calendar from "react-calendar";

export default function DateTimePicker({ time, setTime }) {
    if (!(new Date(time) && typeof setTime === "function")) {
        throw new Error("invalid state management and parameter");
    }

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div style={{ position: "relative" }}>
            {isOpen ? <DTModal time={time} setTime={setTime} /> : <></>}
            <FieldIcon time={time} setIsOpen={setIsOpen} />
        </div>
    );
}

function DTModal({ time, setTime }) {
    return (
        <div className="date-time-modal" style={{ position: "absolute" }}>
            <Calendar value={time} onChange={setTime} />
            <TimeSelect />
        </div>
    );
}

function TimeSelect() {
    return;
}

function FieldIcon({ time, setIsOpen }) {
    const [hover, setHover] = useState(false);
    const h = time.getHours();
    const m = time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes();
    return (
        <div className="date-time-icon">
            {isTomorrow(time)
                ? "Tomorrow, " + (h % 12 === 0 ? 12 : h % 12) + ":" + m + (h > 12 ? "PM" : "AM")
                : time.getMonth() + 1 + "/" + time.getDate() + "/" + time.getFullYear() + " " + (h % 12 === 0 ? 12 : h % 12) + ":" + m + (h > 12 ? "PM" : "AM")}
            <div className="img-hover-wrapper" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={hover ? { backgroundColor: "var(--soft-highlight)" } : {}}>
                <Image src="/calendar.png" alt={"Pick date and time to finalize bet."} height={24} width={24} onClick={() => setIsOpen(true)} />
            </div>
        </div>
    );
}
