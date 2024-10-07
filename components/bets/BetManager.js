import Image from "next/image";
import { isHaram } from "../../functions/AllahValidation";
import { isWinner } from "../../functions/Bet2Ops";
import { useState } from "react";
import { jsql } from "../../functions/AllButThisJSON";
import BetMGModal from "../modals/BetMGModal";

export default function BetManager({ bet }) {
    const [selected, setSelected] = useState(null);

    if (!isHaram(bet)) {
        throw new Error("L: malformed bet object tried to get through");
    }
    const { options } = bet;

    return (
        <div className="bet-manager bet">
            <div className="options-container">
                <div
                    className="options-title"
                    style={{
                        fontWeight: 600,
                        fontSize: 22,
                        textAlign: "left",
                        marginLeft: 16,
                    }}
                >
                    Bet Manager
                </div>
                {options
                    .sort((a, b) => (a.winner ? -Infinity : b.winner ? Infinity : a.oid - b.oid))
                    .map((option, _) => (
                        <AnonOption option={option} isSelected={jsql(option, selected)} setSelected={setSelected} />
                    ))}
            </div>
            <div className="" style={{ color: "var(--icon-color)" }}>
                Selected option
                <br />
                <span style={{ fontWeight: "bold" }}>{selected ? selected.content : "-"}</span>
                <br />
                to win.
            </div>
            <ControlPanel bet={bet} />
        </div>
    );
}

function AnonOption({ option, isSelected, setSelected }) {
    const bgColor = ((option) => {
        if (isWinner(option)) {
            return "var(--not-your-pick)";
        }
        if (isSelected) {
            return "var(--button-background)";
        }
        return "var(--bet-option-button)";
    })(option);

    return (
        <div
            className="client option popped angled"
            style={{
                height: 32,
                borderRadius: 16,
                lineHeight: "32px",
                backgroundColor: bgColor,
                margin: "5px 16px",
                width: "240px",
            }}
            onClick={(_) => setSelected(option)}
        >
            <div className="info">{option.content}</div>
            {isWinner(option) ? <Image src="/crown.png" height={28} width={28} alt="Winner" style={{ marginRight: "10px" }} /> : <></>}
        </div>
    );
}

function ControlPanel({ bet }) {
    return (
        <div className="ctrl-panel">
            <button className="cancel">
                <Image src="/cancel.png" width={24} height={24} style={{ marginTop: "4px" }} />
                Cancel Bet
            </button>
            <button className="cash-out" disabled>
                <Image src="/money.png" width={24} height={24} style={{ marginTop: "4px" }} />
                Cash Winner
            </button>
            <BetMGModal bet={bet} />
        </div>
    );
}
