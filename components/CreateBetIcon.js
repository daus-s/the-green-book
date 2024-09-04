import Image from "next/image";
import {
    isValidLine,
    goodOps,
    validateBet
} from "../functions/AllahValidation";
import { useModal } from "./providers/ModalContext";
import { useAuth } from "./providers/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../functions/SupabaseClient";
import { optToJson } from "../functions/Bet2Ops";

const OPTIONS = "options";
const OVER_UNDER = "over_under";

export default function CreateBetIcon() {
    const [mode, setMode] = useState("options");
    const [line, setLine] = useState("");
    const [group, setGroup] = useState(null);
    const [content, setContent] = useState("");
    const [options, setOptions] = useState(["", ""]);

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
            // sourcery skip: simplify-ternary
            public: group ? false : true,
            open: true,
            content: content,
            line: mode === "over_under" ? line : null
        };
        console.log(betJson);
        const { data: bet, error } = await supabase
            .from("bets2")
            .insert(betJson)
            .select()
            .single();
        console.log(bet);
        if (error) {
            failed();
            return;
        }
        let i = 0;
        if (mode === OPTIONS) {
            console.log(options);
            for (const option of options) {
                const { error: insert } = await supabase
                    .from("options")
                    .insert(optToJson(option, bet.id, i));
                if (insert) {
                    console.log(`failed option ${i}`);
                }
                i++;
            }
        } else if (mode === OVER_UNDER) {
            const { error: insertOver } = await supabase
                .from("options")
                .insert(optToJson("Over", bet.id, 0));
            const { error: insertUnder } = await supabase
                .from("options")
                .insert(optToJson("Under", bet.id, 1));
            if (insertOver) {
                console.log("failed option over");
            }
            if (insertUnder) {
                console.log("failed option under");
            }
        }
        if (error) {
            failed();
        } else {
            succeed();
            clearForm();
        }
    };

    const clearForm = () => {
        setLine("");
        setContent("");
        setOptions(["", ""]);
    };

    const submittable = validateBet({
        mode,
        line: parseFloat(line),
        group,
        content,
        options
    });
    return (
        <div className="create bet">
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start a bet"
            />
            <form className="form" onSubmit={handleSubmit}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginRight: "20px"
                    }}
                >
                    <Line val={line} setVal={setLine} mode={mode} />
                    <Options
                        options={options}
                        setOptions={setOptions}
                        mode={mode}
                    />
                    <GroupSelector group={group} setGroup={setGroup} />
                </div>
                <div
                    className="button-nav"
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <ModeRadio mode={mode} setMode={setMode} />
                    <button
                        type="submit"
                        className={
                            "submit highlightable" +
                            (submittable ? " valid" : "")
                        }
                        style={{
                            borderRadius: "50vh",
                            width: "92px",
                            overflow: "hidden",
                            color: "var(--bright-text)",
                            fontSize: "20px",
                            fontWeight: "600",
                            backgroundColor: submittable
                                ? "var(--button-hover)"
                                : "var(--soft-highlight)",
                            margin: "5px 0 5px 0"
                        }}
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
}
//<Image src="/save2.png" height={24} width={24} alt="submit bet" />

function Option({
    final,
    addOption,
    removeOption,
    index,
    onChange,
    value,
    length
}) {
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
                alignItems: "flex-start"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    height: "38px",
                    alignItems: "center",
                    width: "280px"
                }}
            >
                <div
                    className={"input" + (filled ? " filled" : "")}
                    style={{ position: "relative" }}
                >
                    <input
                        className="option"
                        value={value}
                        onChange={onChange}
                        style={{
                            height: "34px",
                            fontSize: "18px",
                            color: "var(--input-text)",
                            verticalAlign: "bottom"
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
                        <Image
                            className={
                                "delete highlight-button" +
                                (length === 2 ? " disabled" : "")
                            }
                            src="/delete.png"
                            alt="Add option."
                            height={24}
                            width={24}
                            style={{ padding: "2px" }}
                        />
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
                        <Image
                            className="highlight-button"
                            src="/plus.png"
                            alt="Add option."
                            height={24}
                            width={24}
                            style={{ padding: "2px" }}
                        />
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
            //this is bc the int2 restriction on optionID (oid) in the options2 table
            setOptions(shallow);
        }
    };

    const removeViaIndex = (index) => {
        const removed = [...options];
        if (removed.length > 2 && index > 0 && index < removed.length) {
            removed.splice(index, 1);
            setOptions(removed);
        }
    };

    const alter = (value, index) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    if (mode === "options") {
        return (
            <div
                className="options-container"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "fit-content",
                    margin: "0px 0px 5px 20px"
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
                        height: "36px"
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
                            marginTop: "2px"
                        }}
                    />
                </div>
                <div
                    className="tell-u-what-a-line-is"
                    style={{ height: "40px", marginLeft: "20px" }}
                >
                    {isValidLine(parseFloat(val)) ? (
                        <>
                            <div
                                className="over-info"
                                style={{ height: "20px" }}
                            >
                                If the result is over {val} the
                                <span
                                    style={{
                                        fontWeight: "bold"
                                    }}
                                >
                                    over
                                </span>
                                wins.
                            </div>
                            <div
                                className="under-info"
                                style={{ height: "20px" }}
                            >
                                If the result is under {val} the{" "}
                                <span style={{ fontWeight: "bold" }}>
                                    under
                                </span>
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
        <div
            className="radio-type-container highlightable"
            style={{ display: "flex", flexDirection: "row" }}
        >
            <input
                type="radio"
                onChange={() => setMode("options")}
                checked={mode === "options"}
                id="options-radio"
            />
            <label htmlFor="options-radio">
                <Image
                    src="/poll.png"
                    alt="Poll radio."
                    height={32}
                    width={32}
                />
            </label>

            <input
                className="over-under"
                type="radio"
                onChange={() => setMode("over_under")}
                checked={mode === "over_under"}
                id="over-under-radio"
            />
            <label htmlFor="over-under-radio">O/U</label>
        </div>
    );
}

//if group is null it should be a public bet
function GroupSelector({ setGroup, group }) {
    const { meta } = useAuth();
    const [groups, setGroups] = useState(undefined);
    const getGroups = async () => {
        const { data, error } = await supabase
            .from("groups")
            .select("*, user_groups (*)")
            .eq("user_groups.userID", meta.id);
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
                position: "relative"
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
                        fontSize: "24px",
                        color: "var(--infomercial)",
                        pointerEvents: "none"
                    }}
                >
                    (public)
                </div>
            )}
            <select
                style={{ width: "180px", height: "1.5em" }}
                onChange={changeWrapper}
            >
                <option
                    key={-1}
                    value={null}
                    style={{ fontWeight: "100", color: "red" }}
                ></option>
                {groups?.map((group, index) => {
                    return (
                        <option key={index} value={group.groupID}>
                            {group.groupName}
                        </option>
                    );
                })}
            </select>
            <label style={{ fontWeight: "normal", fontSize: "16px" }}>
                Group
            </label>
        </div>
    );
}

function Spacer() {
    return <div className="spacer" style={{ height: "100%", width: "4px" }} />;
}
