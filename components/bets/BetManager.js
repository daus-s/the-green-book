import Image from "next/image";
import { isHaram } from "../../functions/AllahValidation";
import { isWinner } from "../../functions/Bet2Ops";

export default function BetManager({ bet }) {
    if (isHaram(bet)) {
        throw new Error("L: malformed bet object tried to get through");
    }
    const options = bet.options;
    console.log(options);

    return (
        <div className="bet-manager bet">
            <div className="options-container">
                {options
                    .sort((a, b) => b.oid - a.oid)
                    .map((option, _) => (
                        <AnonOption option={option} />
                    ))}
            </div>
            <button
                className="cancel"
                style={{
                    height: "40px",
                    width: "40px",
                    borderRadius: 20,
                    padding: 0,
                    border: "none",
                }}
            >
                <Image src="/cancel.png" width={32} height={32} style={{ marginTop: "4px" }} />
            </button>
            <button className="cancel" disabled>
                Cash Out Winner
            </button>
        </div>
    );
}

function AnonOption({ option }) {
    const bgColor = ((option) => {
        if (isWinner(option)) {
            return "";
        }
        return "var(--bet-option-button)";
    })(option);

    return (
        <div className="option popped" style={{ height: 32, borderRadius: 16, lineHeight: "32px", backgroundColor: bgColor }}>
            {JSON.stringify(option)}
        </div>
    );
}
