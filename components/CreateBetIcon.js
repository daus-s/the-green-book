import Image from "next/image";
import { isValidLine, isHaram } from "../functions/AllahValidation";
import { useModal } from "./providers/ModalContext";
import { useAuth } from "./providers/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../functions/SupabaseClient";
import { optToJson } from "../functions/Bet2Ops";
import DateTimePicker from "./timing/TimeSelector";

const OPTIONS = "options";
const OVER_UNDER = "over_under";

export default function CreateBetIcon() {
    const [mode, setMode] = useState("options");
    const [line, setLine] = useState("");
    const [group, setGroup] = useState(null);
    const [content, setContent] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [submittable, setSubmittable] = useState(null);
    const [dueAt, setDueAt] = useState(new Date(Date.now() + 86_400_000)); // 24 hr/d * 60 min/hr * 60 60s/ms * 1000 ms/s

    const { failed, succeed } = useModal();
    const { meta } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (mode === "over_under" && !isValidLine(parseFloat(line))) {
            //setLineErr
            return;
        }

        const gid = parseInt(group);

        const betJson = {
            creator: meta.id,
            g: group ? gid : null,
            public: !group,
            open: true,
            content: content,
            line: mode === "over_under" ? line : null,
        };

        console.log(betJson);

        const { data: retrievedBet, error: sendError } = await supabase.from("bets2").insert(betJson).select("*").single();

        if (sendError) {
            failed("Couldn't create your bet.");
            return;
        }

        let i = 0;
        if (mode === OPTIONS) {
            console.log(options);

            for (const option of options) {
                const { error: insert } = await supabase.from("options").insert(optToJson(option, retrievedBet.id, i));

                if (insert) {
                    console.error(`failed option ${i}`);
                }
                i++;
            }
        } else if (mode === OVER_UNDER) {
            const { error: insertOver } = await supabase.from("options").insert(optToJson("Over", bet.id, 0));

            const { error: insertUnder } = await supabase.from("options").insert(optToJson("Under", bet.id, 1));

            const { error: insertLine } = isWhole(line) && (await supabase.from("options").insert(optToJson("Line", bet.id, 2)));

            if (insertOver) {
                console.error("failed to create option: over");
            }
            if (insertUnder) {
                console.error("failed to create option: under");
            }
            if (insertLine) {
                console.error("failed to create option: line");
            }
        }

        succeed();
        clearForm();
    };

    const clearForm = () => {
        setLine("");
        setContent("");
        setOptions(["", ""]);
    };

    const checkSubmittable = () => {
        const submittable = isHaram(
            {
                mode,
                line: parseFloat(line) || null,
                group,
                content: content,
                options,
            },
            true
        );

        if (submittable) {
            setSubmittable(true);
        } else {
            setSubmittable(false);
        }
    };

    return (
        <div className="create bet">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Start a bet" onBlur={checkSubmittable} />
            <form className="form" onSubmit={handleSubmit}>
                <div
                    style={{
                        marginRight: "18px",
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gridTemplateRows: "1fr 1fr",
                    }}
                >
                    <Line val={line} setVal={setLine} mode={mode} checkSubmittable={checkSubmittable} />
                    <Options options={options} setOptions={setOptions} mode={mode} checkSubmittable={checkSubmittable} />
                    <GroupSelector group={group} setGroup={setGroup} />
                    <DateTimePicker time={dueAt} setTime={setDueAt} />
                </div>
                <Buttons mode={mode} setMode={setMode} submittable={submittable} />
            </form>
        </div>
    );
}
//<Image src="/save2.png" height={24} width={24} alt="submit bet" />

function Option({ final, addOption, removeOption, index, onChange, value, length }) {
    if (typeof addOption !== "function" || typeof removeOption !== "function") {
        throw new Error("cannot create a button without a function");
    }

    const filled = Boolean(value.length);
    return (
        <div
            className="option"
            style={{
                width: "fit-content",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "38px",
                    alignItems: "center",
                    width: "280px",
                }}
            >
                <div className={"input" + (filled ? " filled" : "")} style={{ position: "relative" }}>
                    <input
                        className="option"
                        value={value}
                        onChange={onChange}
                        style={{
                            height: "34px",
                            fontSize: "18px",
                            color: "var(--input-text)",
                            verticalAlign: "bottom",
                        }}
                    />
                    <div className="placeholder">Option {index + 1}</div>
                </div>
                <Spacer />
                {(index && index - 1) || true ? (
                    <button
                        style={{ padding: 0 }}
                        onClick={(e) => {
                            e.preventDefault();
                            removeOption();
                        }}
                    >
                        <Image className={"delete highlight-button" + (length === 2 ? " disabled" : "")} src="/delete.png" alt="Add option." height={24} width={24} style={{ padding: "2px" }} />
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
                        <Image className="highlight-button" src="/plus.png" alt="Add option." height={24} width={24} style={{ padding: "2px" }} />
                    </button>
                ) : (
                    <div style={{ width: "20px", marginLeft: "4px" }} />
                )}
            </div>
        </div>
    );
}

function Options({ options, setOptions, mode, checkSubmittable }) {
    const addOption = () => {
        const shallow = [...options];
        shallow.push("");
        if (shallow.length < 65536) {
            //this is bc the int2 restriction on optionID (oid) in the options2 table
            setOptions(shallow);
        }
        checkSubmittable();
    };

    const removeViaIndex = (index) => {
        const removed = [...options];
        if (removed.length > 2 && index > 0 && index < removed.length) {
            removed.splice(index, 1);
            setOptions(removed);
            checkSubmittable();
        }
        checkSubmittable();
    };

    const alter = (value, index) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);

        checkSubmittable();
    };

    if (mode === "options") {
        return (
            <div
                className="options-container options-column"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "fit-content",
                    margin: "0px 0px 5px 20px",
                }}
            >
                {options.map((val, index) => {
                    const removeOption = () => removeViaIndex(index);
                    const onChange = (e) => alter(e.target.value, index);
                    return (
                        <Option
                            key={index}
                            val={val}
                            index={index}
                            final={index === options.length - 1}
                            addOption={addOption}
                            removeOption={removeOption}
                            value={options[index]}
                            onChange={onChange}
                            length={options.length}
                        />
                    );
                })}
            </div>
        );
    }
}

function Line({ val, setVal, mode, checkSubmittable }) {
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

    if (mode === "over_under") {
        return (
            <div className="line-box-container">
                <div
                    className="line-box"
                    style={{
                        marginLeft: "20px",
                        marginBottom: "5px",
                        marginRight: "auto",
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        height: "36px",
                    }}
                >
                    <label className="line">Line</label>
                    <input
                        className="line"
                        value={val}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="0.5"
                        style={{
                            marginRight: "auto",
                            width: "248px",
                            marginTop: "2px",
                        }}
                        onBlur={checkSubmittable}
                    />
                </div>
                <div className="tell-u-what-a-line-is" style={{ height: "40px", marginLeft: "20px" }}>
                    {isValidLine(parseFloat(val)) ? (
                        <>
                            <div className="over-info" style={{ height: "20px" }}>
                                If the result is over {val} the
                                <span
                                    style={{
                                        fontWeight: "bold",
                                    }}
                                >
                                    over
                                </span>
                                wins.
                            </div>
                            <div className="under-info" style={{ height: "20px" }}>
                                If the result is under {val} the <span style={{ fontWeight: "bold" }}>under</span>
                                wins.
                            </div>
                        </>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
        );
    }

    return <></>;
}
//(e) => handleChange(e.target.value)

function ModeRadio({ mode, setMode }) {
    return (
        <div className="radio-type-container highlightable" style={{ display: "flex", flexDirection: "row" }}>
            <input type="radio" onChange={() => setMode("options")} checked={mode === "options"} id="options-radio" />
            <label htmlFor="options-radio">
                <Image src="/poll.png" alt="Poll radio." height={32} width={32} />
            </label>

            <input className="over-under" type="radio" onChange={() => setMode("over_under")} checked={mode === "over_under"} id="over-under-radio" />
            <label htmlFor="over-under-radio">O/U</label>
        </div>
    );
}

//if group is null it should be a public bet
function GroupSelector({ setGroup, group }) {
    const { meta } = useAuth();
    const [groups, setGroups] = useState(undefined);
    const getGroups = async () => {
        const { data, error } = await supabase.from("groups").select("*, user_groups (*)").eq("user_groups.userID", meta.id);
        if (error) {
            return;
        }
        setGroups(data);
    };
    useEffect(() => {
        if (meta.id) {
            getGroups();
        }
    }, [meta]);

    const changeWrapper = (e) => {
        e.preventDefault();
        console.log(e.target.value);
        if (e.target.value === null) {
            setGroup(e.target.value);
        }
        setGroup(parseInt(e.target.value));
    };

    return (
        <div
            className="group-selector"
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                position: "relative",
                gridArea: "1 / 2 / 2 / 3",
            }}
        >
            {group ? (
                <></>
            ) : (
                <div
                    className="public-notice"
                    style={{
                        position: "absolute",
                        left: "2px",
                        marginTop: "4px",
                        marginRight: "2px",
                        marginLeft: "47px",
                        fontSize: "24px",
                        color: "var(--infomercial)",
                        pointerEvents: "none",
                    }}
                >
                    Group
                </div>
            )}
            <select style={{ width: "180px", height: "1.5em" }} onChange={changeWrapper}>
                <option key={-1} value={null} style={{ fontWeight: "100", color: "red" }}></option>
                {groups?.map((group, index) => {
                    return (
                        <option key={index} value={group.groupID}>
                            {group.groupName}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}

function Spacer() {
    return <div className="spacer" style={{ height: "100%", width: "4px" }} />;
}

function Submit({ submittable }) {
    return (
        <button
            type="submit"
            disabled={!submittable}
            className={"submit highlightable" + (submittable ? " valid" : "")}
            style={{
                borderRadius: "50vh",
                width: "92px",
                overflow: "hidden",
                color: "var(--bright-text)",
                fontSize: "20px",
                fontWeight: "600",
                backgroundColor: submittable ? "var(--button-hover)" : "var(--soft-highlight)",
                margin: "5px 0 5px 0",
            }}
        >
            Post
        </button>
    );
}

function Buttons({ mode, setMode, submittable }) {
    return (
        <div
            className="button-nav"
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
            }}
        >
            <ModeRadio mode={mode} setMode={setMode} />
            <Submit submittable={submittable} />
        </div>
    );
}
