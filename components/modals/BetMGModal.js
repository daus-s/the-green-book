import React from "react";
import Modal from "react-modal";
import { useMobile } from "../providers/MobileContext";
import Image from "next/image";

const BetMGModal = ({ isOpen, onCancel, bet }) => {
    if (!bet) {
        throw new Error("cannot operate on a bet");
    }

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
                <Options bet={bet} />
                <button className="cancel" style={{ width: "fit-content", margin: "auto" }} disabled>
                    <Image src="/cancel.png" width={24} height={24} style={{ marginTop: "4px" }} />
                    Cancel Bet
                </button>
            </div>
        </Modal>
    );
};

function Options({ bet }) {
    if (!bet) {
        throw new Error("cannot operate on a bet");
    }

    const { options } = bet;

    return (
        <form className="options">
            {options.map((option) => (
                <OptionRadio option={option} />
            ))}
        </form>
    );
}

function OptionRadio({ option }) {
    if (!option.content) {
        throw new Error("No content found in option.");
    }

    return (
        <label for="contactChoice1">
            <input type="radio" id="contactChoice1" name="contact" value="email" />
            {option.content}
        </label>
    );
}

function Icons({ bet }) {
    if (!bet) {
        throw new Error("cannot operate on a bet");
    }
    return <div className="icons"></div>;
}

export default BetMGModal;
