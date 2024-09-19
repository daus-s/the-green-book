import Image from "next/image";

export default function BetManager({ bet }) {
    return (
        <div className="bet-manager bet">
            <button
                className="cancel"
                style={{
                    height: "40px",
                    width: "40px",
                    borderRadius: 20,
                    padding: 0,
                    border: "none"
                }}
            >
                <Image
                    src="/cancel.png"
                    width={32}
                    height={32}
                    style={{ marginTop: "4px" }}
                />
            </button>
            <button className="cancel" disabled>
                Cash Out Winner
            </button>
        </div>
    );
}
