import { useState } from "react";
import Modal from "react-modal";
import FriendButton from "./FriendButton";
import User from "./User";

export default function ProfilePopout({ user, style }) {
    const [isOpen, setIsOpen] = useState(true);

    if (!user.pfp_url || !user.id || !user.display || !user.username) {
        return null;
    }

    const closeModal = () => setIsOpen(false);

    const muffle = (e) => {
        e.stopPropagation();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={closeModal}
            style={{
                overlay: {
                    backgroundColor: "var(--clear)",
                    zIndex: 1000, // Adjust the value based on your layout
                },
                content: {
                    backgroundColor: "var(--bet-background-color)",
                    borderColor: "var(--bet-option-highlight)",
                    position: "absolute",
                    width: "260px",
                    height: "fit-content",
                    top: "50%",
                    left: "50%",
                    transform: "translate(calc(-100% + 60px), calc(-50% + 30px))",
                    padding: "10px",
                    zIndex: "10000000",
                    pointerEvents: "auto",
                    ...style,
                },
            }}
        >
            <div className="profile-popout modal" onClick={muffle}>
                <User user={user} />
                <FriendButton id={user.id} />
            </div>
        </Modal>
    );
}
