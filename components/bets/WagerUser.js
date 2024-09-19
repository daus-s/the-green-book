import Image from "next/image";

export default function WagerUser({ user }) {
    return (
        <div
            className="user"
            style={{
                display: "flex",
                flexDirection: "row"
            }}
        >
            <Image
                src={user.pfp_url}
                height={40}
                width={40}
                style={{ borderRadius: "50%", marginRight: "4px" }}
                alt={`${user.username}'s profile picture`}
            />

            <div
                className="contact-info"
                style={{ width: "calc(100% - 40px)" }}
            >
                <div
                    className="display"
                    style={{
                        fontSize: "22px",
                        marginBottom: 0,
                        textAlign: "left",
                        color: "var(--bright-text)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textWrap: "nowrap",
                        width: "100%"
                    }}
                >
                    {user.display}
                </div>
                <div
                    className="username"
                    style={{
                        fontSize: "14px",
                        marginBottom: "0px",
                        textAlign: "left",
                        color: "var(--unimportant-text)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        textWrap: "nowrap",
                        width: "100%"
                    }}
                >
                    @{user.username}
                </div>
            </div>
        </div>
    );
}
