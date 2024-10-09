import { useMobile } from "../providers/MobileContext";
import { useState } from "react";
import Modal from "react-modal";
import Image from "next/image";

const BetMGModal = ({ isOpen, onCancel, bet }) => {
    if (!bet) {
        throw new Error("cannot operate on a bet");
    }

    const [selectedWinner, setSelectedWinner] = useState(null);

    const { isMobile } = useMobile();
    return (
        <Modal
            isOpen={true}
            onRequestClose={onCancel}
            style={{
                overlay: {
                    backgroundColor: "var(--overlay)",
                    zIndex: 1000,
                },
                content: {
                    backgroundColor: "var(--bet-background-color)",
                    width: isMobile ? "calc(100% - 20px)" : "765px",
                    height: isMobile ? "fit-content" : "400px",
                    position: isMobile ? "fixed" : "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                },
            }}
        >
            <div className="modal bet-manager" style={isMobile ? { height: "auto" } : {}}>
                <Icons bet={bet} />
                <Options bet={bet} selectedWinner={selectedWinner} setSelectedWinner={setSelectedWinner} />
                <CancelButton />
                <CashButton />
            </div>
        </Modal>
    );
};

function Options({ bet, selectedWinner, setSelectedWinner }) {
    if (!bet) {
        throw new Error("cannot operate on a bet");
    }

    const { options } = bet;

    return (
        <form className="options">
            {options.map((option) => (
                <OptionRadio option={option} isSelected={selectedWinner === option} setSelectedWinner={() => setSelectedWinner(option)} />
            ))}
        </form>
    );
}

function OptionRadio({ option, isSelected, setSelectedWinner }) {
    if (!option.content) {
        throw new Error("No content found in option.");
    }

    return (
        <label>
            <input type="radio" name="bet-option" value={option.content} checked={isSelected} onChange={setSelectedWinner} />
            {option.content}
        </label>
    );
}

function Icons({ bet }) {
    if (!bet) {
        throw new Error("cannot operate on a bet");
    }

    const iconSrc = bet.group ? "/private.png" : "/earth.png";

    return (
        <div className="icons">
            <Image src={iconSrc} alt={bet.group ? "Private Bet" : "Public Bet"} width={32} height={32} />
        </div>
    );
}

function CashButton({}) {
    return (
        <button className="cash-out" style={{ width: "fit-content", margin: "auto" }}>
            <Image src="/money.png" width={24} height={24} style={{ marginTop: "4px" }} />
            Cash Winner
        </button>
    );
}

function CancelButton({}) {
    return (
        <button className="cancel" style={{ width: "fit-content", margin: "auto" }} disabled>
            <Image src="/cancel.png" width={24} height={24} style={{ marginTop: "4px" }} />
            Cancel Bet
        </button>
    );
}
export default BetMGModal;
