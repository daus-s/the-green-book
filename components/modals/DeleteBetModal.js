import React from "react";
import Modal from "react-modal";
import { useMobile } from "../providers/MobileContext";
import Image from "next/image";

const ConfirmModal = ({ isOpen, onCancel }) => {
    const { isMobile } = useMobile();
    return (
        <Modal
            isOpen={true}
            onRequestClose={onCancel}
            style={{
                overlay: {
                    backgroundColor: "var(--overlay)",
                    zIndex: 1000
                },
                content: {
                    backgroundColor: "var(--bet-background-color)",
                    width: isMobile ? "calc(100% - 20px)" : "768px",
                    height: isMobile ? "fit-content" : "400px",
                    position: isMobile ? "fixed" : "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)"
                }
            }}
        >
            <div className="modal" style={isMobile ? { height: "auto" } : {}}>
                <button
                    className="cancel"
                    style={{ width: "fit-content" }}
                    disabled
                >
                    <button className="cancel">
                        <Image
                            src="/cancel.png"
                            width={24}
                            height={24}
                            style={{ marginTop: "4px" }}
                        />
                        Cancel Bet
                    </button>
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
