export default function Notification({ notification, key }) {
    console.log("choosing notification...");
    console.log(notification);
    switch (notification.code) {
        case 0: //err code all falsy values coerce to 0
            console.log("choosing err");
            return <></>;
        case 1:
            console.log("choosing friend_request");
            return <FriendRequestNotification notification={notification} key={key} />;
        default:
            console.log("choosing WTF");
    }
}

function FriendRequestNotification(notification) {
    console.log("creating notification...");
    return (
        <div className={"notification friend-request " + (notification.viewed ? "" : "new")}>
            {JSON.stringify(notification)}
            <button className="accept">accept</button>
            <button className="reject">reject</button>
        </div>
    );
}
