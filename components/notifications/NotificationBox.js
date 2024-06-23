import { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import Notification from "./NotificationTypes";
import { select } from "../../functions/NotificationReader";
import { useMobile } from "../providers/MobileContext";

Modal.setAppElement("#__next");

const NotificationBox = ({ isOpen, onClose, notifications, meta }) => {
    const [viewing, setViewing] = useState(select(notifications));

    const { isMobile } = useMobile();
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

    useEffect(() => {
        setViewing(select(notifications));
    }, [notifications]);

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
                    top: isMobile ? "64px" : "81px",
                    right: isMobile ? "63px" : "213px",
                    marginLeft: "auto",
                    zIndex: "10000000",
                    height: "fit-content",
                    width: isMobile ? "216px" : "320px",
                    padding: "0px",
                    pointerEvents: "auto",
                },
            }}
        >
            <div className="modal" ref={ref}>
                <div className="notification-header" style={{ padding: "10px" }}>
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
                    {viewing.length ? (
                        viewing.map((n, i) => {
                            return <Notification notification={n} key={i} meta={meta} />;
                        })
                    ) : (
                        <div className="no-notifications" style={{ color: "var(--unimportant-text)", textAlign: "center", padding: "10px 5px", fontWeight: "600" }}>
                            No notifications
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default NotificationBox;