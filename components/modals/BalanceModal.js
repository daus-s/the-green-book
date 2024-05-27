import Modal from "react-modal";

const BalanceModal = () => {
    return (
        <Modal
            portalClassName="balance-modal"
            isOpen={isOpen}
            onRequestClose={onClose}
            style={{
                overlay: {
                    backgroundColor: "var(--overlay)",
                    zIndex: 1000, // Adjust the value based on your layout
                },
                content: {
                    backgroundColor: "var(--bet-background-color)",
                    borderColor: "var(--bet-option-highlight)",
                    width: "200px",
                    height: "100px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    padding: "10px",
                    zIndex: "10000000",
                },
            }}
        >
            <div className="modal">
                <div className="balance-title">Pay</div>
                <span onClick={onClose} style={{ /*hover style here?*/ borderRadius: "50%", position: "absolute", top: "5px", right: "10px" }}>
                    &times;
                </span>
                <div>select user</div>
                <div>choose amount</div>
                <div>pay</div>
                <div>confirm modal too?</div>
            </div>
        </Modal>
    );
};

export default BalanceModal;
