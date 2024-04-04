import {  useState } from "react";
import CommishRequests from "./CommishRequests";
import Notification from "./Notification";

export default function Commishify() {
    const [count, setCount] = useState(0);

    return (
        <div className="commissioner-requests">
            <div className="requests-container-title notification-box" style={{width: 'fit-content'}}>
                        Commission Requests
                        <Notification count={count}/>
                    </div>
            <div className="notification-box">
                <CommishRequests setCount={setCount} />
            </div>
        </div>
    );
}