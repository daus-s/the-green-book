import { isTomorrow } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { generateDates } from "../../functions/Calend";

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
    const [year, setYear] = useState(time.getFullYear());
    const [month, setMonth] = useState(time.getMonth());
    const [day, setDay] = useState(time.getDate());
    const [hour, setHour] = useState(time.getHours());

    const nextMonth = (e) => {
        e.preventDefault();

        let mTemp = month;
        mTemp++;

        if (mTemp >= 12) {
            mTemp %= 12;
            setYear((y) => y++);
        }

        setMonth(mTemp);
    };
    const prevMonth = (e) => {
        e.preventDefault();

        let mTemp = month;
        mTemp--;

        if (mTemp >= 12) {
            mTemp %= 12;
            setYear((y) => y++);
        }

        setMonth(mTemp);
    };

    // useEffect(() => {}, [day, hour, month, year]);
    const dates = generateDates(month, year);

    return (
        <div className="date-time-modal" style={{ position: "absolute" }}>
            <MonthSelector month={month} increment={nextMonth} decrement={prevMonth} />
            {dates ? <Calendar dates={dates} /> : <></>}
            <TimeSelect />
        </div>
    );
}

function Calendar({ dates }) {
    return (
        <div className="cldnr">
            <div className="hd"></div>
            {dates?.map((date) => {
                return <DaySelector date={date} />;
            })}
        </div>
    );
}

function DaySelector({ date }) {
    console.log(date);
    const weekConstant = ["a", "b", "c", "d", "e", "f"][date.week];
    const dateConstant = ["th", "fr", "sa", "su", "mo", "tu", "we"][date.dow];

    return (
        <div className={`cb ${weekConstant} ${dateConstant}`} key={`${date.basetime}`}>
            {date.display}
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

function MonthSelector({ month, increment, decrement }) {
    const months = ["Decmeber", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November"];

    return (
        <div>
            <button onClick={decrement}>{"<"}</button>
            {months[month]}
            <button onClick={increment}>{">"}</button>
        </div>
    );
}
