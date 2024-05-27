import { useState } from "react";
import CommishRequests from "./CommishRequests";
import NotificationCounter from "./NotificationCounter";

export default function Commishify() {
    const [count, setCount] = useState(0);

    return (
        <div className="commissioner-requests admin-child">
            <div className="requests-container-title notification-box" style={{ width: "fit-content" }}>
                Commission Requests
                <NotificationCounter count={count} />
            </div>
            <div className="notification-box">
                <CommishRequests setCount={setCount} />
            </div>
        </div>
    );
}
