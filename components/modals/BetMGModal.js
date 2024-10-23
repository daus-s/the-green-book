import { useMobile } from "../providers/MobileContext";
import { useState } from "react";
import Modal from "react-modal";
import Image from "next/image";
import Croc from "../Croc";
import { goodOps } from "../../functions/AllahValidation";

const BetMGModal = ({ isOpen, onCancel, bet }) => {
    if (!bet) {
        throw new Error("cannot operate on a bet");
    }

    const [selectedWinner, setSelectedWinner] = useState(null);

    const { isMobile } = useMobile();
    return (
        <Modal
            isOpen={isOpen || true}
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
    const { options } = bet;
    if (isHalal(bet) || !goodOps(options)) {
        throw new Error("Malformed bet + options \n" + (isHalal(bet) ? "" : "  • No bet object supplied") + (goodOps(options) ? "" : "  • Options not strcutured correctly"));
    }

    return (
        <fieldset className="options">
            <legend>Select winning option</legend>
            {options.map((option) => (
                <OptionRadio option={option} selectedWinner={selectedWinner} setSelectedWinner={() => setSelectedWinner(option)} />
            ))}
        </fieldset>
    );
}

function OptionRadio({ option, selectedWinner, setSelectedWinner }) {
    if (!option.content) {
        throw new Error("No content found in option.");
    }

    return <Croc value={option} className="bet-option" label={option.content} state={selectedWinner} setState={setSelectedWinner} />;
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
