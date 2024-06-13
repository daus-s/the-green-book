import React, { useEffect } from "react";
import Modal from "react-modal";
import { useMobile } from "../providers/MobileContext";

const ADModal = ({ isOpen, onClose, onConfirm, approve, guest, groupName }) => {
    //approve is a bool
    const { isMobile } = useMobile();

    if (!(approve === false) && !(approve === true)) {
        throw new Error(`approve prop must be a defined boolean variable. approve=${typeof approve}`);
    }
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: {
                    backgroundColor: "var(--overlay)",
                    zIndex: 1000,
                },
                content: {
                    backgroundColor: "var(--bet-background-color)",
                    borderColor: "var(--bet-option-highlight)",
                    width: isMobile ? "calc(100% - 20px)" : "600px",
                    height: isMobile ? "200px" : "300px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    padding: "20px 10px 10px 20px",
                    zIndex: "10000000",
                },
            }}
        >
            <div className="modal">
                <div className="modal-title">{approve ? "Approve join request" : "Deny join request"}</div>
                <div className="request-text">
                    {approve ? (
                        <>
                            Are you sure you want to let <b>{guest?.username}</b> join {groupName ? groupName : "this group"}?
                        </>
                    ) : (
                        <>
                            Are you sure you want ignore <b>{guest?.username}</b>'s request to join {groupName ? groupName : "this group"}?
                        </>
                    )}
                </div>
                <div className="button-container">
                    <button className="cancel-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="confirm-button skinny" onClick={onConfirm}>
                        {approve ? "Accept" : "Ignore"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ADModal;
