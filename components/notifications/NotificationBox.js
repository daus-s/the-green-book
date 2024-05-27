import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import Notification from "./NotificationTypes";

Modal.setAppElement("#__next");

const NotificationBox = ({ isOpen, onClose, notifications }) => {
    const ref = useRef(null);

    useEffect(() => {
        function handleClick(event) {
            if (!isOpen) {
                return;
            }
            if (!ref || !ref.current) {
                return;
            }
            const inside = ref.current.contains(event.target);
            if (!inside) {
                onClose();
            }
        }

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [isOpen]);

    return (
        <Modal
            portalClassName="notification-box modal"
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: {
                    backgroundColor: "var(--clear)",
                    zIndex: 1000, // Adjust the value based on your layout
                    pointerEvents: "none",
                },
                content: {
                    backgroundColor: "var(--bet-background-color)",
                    borderColor: "var(--bet-option-highlight)",
                    position: "fixed",
                    top: "81px",
                    right: "213px",
                    marginLeft: "auto",
                    zIndex: "10000000",
                    height: "fit-content",
                    width: "320px",
                    padding: "0px",
                    pointerEvents: "auto",
                },
            }}
        >
            <div className="modal" style={{ padding: "10px" }} ref={ref}>
                <div className="notification-header">
                    <div className="notification-title">Notifications</div>
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        style={{ borderRadius: "50%", position: "absolute", top: "5px", right: "10px", cursor: "pointer" }}
                    >
                        &times;
                    </span>
                </div>
                <div className="notifications">
                    {notifications.map((n, i) => {
                        return <Notification notification={n} key={i} />;
                    })}
                </div>
            </div>
        </Modal>
    );
};

export default NotificationBox;
