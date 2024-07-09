import Image from "next/image";
import { useModal } from "./providers/ModalContext";
import { useAuth } from "./providers/AuthContext";
import { useState } from "react";
import { supabase } from "../functions/SupabaseClient";

export default function CreateBetIcon() {
    const [mode, setMode] = useState("options");
    const [line, setLine] = useState("");
    const [content, setContent] = useState("");
    const [options, setOptions] = useState(["", ""]);

    const { failed, succeed } = useModal();
    const { meta } = useAuth();

    const handleSubmit = async () => {
        const isValidLine = (x) => {
            if (x % 1 === 0.5) {
                setVal(f);
            }
        };

        const betJson = {
            creator: meta.id,
        };
        const { error } = await supabase.from("bets2").insert(betJson);
        error ? failed() : succeed();
    };

    return (
        <div className="create bet">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start a bet" />
            <form className="form" onSubmit={handleSubmit}>
                <Line val={line} setVal={setLine} mode={mode} />
                <Options options={options} setOptions={setOptions} mode={mode} />
                <div className="button-nav" style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                    <ModeRadio mode={mode} setMode={setMode} />
                    <button type="submit" className="submit highlightable">
                        <Image src="/accept.png" height={32} width={32} />
                    </button>
                </div>
            </form>
        </div>
    );
}

function Option({ final, addOption, removeOption, index }) {
    if (typeof addOption !== "function" || typeof removeOption !== "function") {
        throw new Error("cannot create a button without a function");
    }
    const [data, setData] = useState("");

    const filled = Boolean(data.length);
    return (
        <div className="option" style={{ width: "fit-content", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <div style={{ display: "flex", flexDirection: "row", height: "38px", alignItems: "center", width: "276px" }}>
                <div className={"input" + (filled ? " filled" : "")} style={{ position: "relative" }}>
                    <input
                        className="option"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        style={{ height: "34px", fontSize: "18px", color: "var(--input-text)", paddingBottom: "0px", verticalAlign: "bottom" }}
                    />
                    <div className="placeholder">Option {index + 1}</div>
                </div>
                {index ? (
                    <button
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.preventDefault();
                            removeOption();
                        }}
                    >
                        <Image className="highlight-button" src="/remove.png" alt="Add option." height={16} width={16} style={{ marginLeft: "4px" }} />
                    </button>
                ) : (
                    <></>
                )}
                {final ? (
                    <button
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.preventDefault();
                            addOption();
                        }}
                    >
                        <Image className="highlight-button" src="/plus.png" alt="Add option." height={20} width={20} style={{ marginLeft: "4px" }} />
                    </button>
                ) : (
                    <div style={{ width: "20px", marginLeft: "4px" }} />
                )}
            </div>
        </div>
    );
}

function Options({ options, setOptions, mode }) {
    const addOption = () => {
        const shallow = [...options];
        shallow.push("");
        if (shallow.length < 65536) {
            //this is bc the int2 restrivtion on optionid (oid) in the options2 table
            setOptions(shallow);
        }
    };

    const removeViaIndex = (index) => {
        const shallow = [...options];
        shallow.remove(1);
        if (shallow.length > 2 && index < remove.length - 1) {
            setOptions(shallow);
        }
    };

    if (mode === "options") {
        return (
            <div className="options-container" style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "fit-content", margin: "0px 0px 5px 20px" }}>
                {options.map((val, index) => {
                    const removeOption = () => removeViaIndex(index);
                    return <Option key={index} val={val} index={index} final={index === options.length - 1} addOption={addOption} removeOption={removeOption} />;
                })}
            </div>
        );
    }
}

function Line({ val, setVal, mode }) {
    const handleChange = (f) => {
        if (f.length === 0) {
            setVal("");
        }
        const x = parseFloat(f);
        console.log(typeof x !== "number" || isNaN(x));
        if (typeof x !== "number" || isNaN(x)) {
            return;
        }
        setVal(f);
    };

    if (mode === "over_under")
        return (
            <>
                <label className="line">Line</label>
                <input className="line" value={val} onChange={(e) => handleChange(e.target.value)} placeholder="0.5" />
            </>
        );

    return <></>;
}
//(e) => handleChange(e.target.value)

function ModeRadio({ mode, setMode }) {
    return (
        <div className="radio-type-container highlightable" style={{ display: "flex", flexDirection: "row" }}>
            <input
                type="radio"
                onChange={(e) => {
                    e.preventDefault();
                    setMode("options");
                }}
                checked={mode === "options"}
                id="options-radio"
            />
            <label htmlFor="options-radio">
                <Image src="/poll.png" alt="Poll radio." height={32} width={32} />
            </label>

            <input
                className="over-under"
                type="radio"
                onChange={(e) => {
                    e.preventDefault();
                    setMode("over_under");
                }}
                checked={mode === "over_under"}
                id="over-under-radio"
            />
            <label htmlFor="over-under-radio">O/U</label>
        </div>
    );
}
