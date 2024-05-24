export default function Opponent({ user, error }) {
    if (user) {
        return (
            <div className="opponent">
                <img src={user?.pfp_url} style={{ borderRadius: "50%", height: "36px" }} />
                <div className="text-fields">
                    <div className="username">{user?.username}</div>
                </div>
            </div>
        );
    } else {
        return <div className="opponent" style={{ backgroundColor: "transparent" }} />;
    }
}
