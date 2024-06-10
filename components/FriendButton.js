import React, { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { supabase } from "../functions/SupabaseClient";
import Image from "next/image";

const AddFriendButton = ({ onClick, onMouseEnter, onMouseLeave, className }) => {
    return (
        <button className={className + " friend-button-action"} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <Image className={className + " image"} src="/addfriend.png" width={40} height={40} />
        </button>
    );
};
const CancelRequestButton = ({ onClick, onMouseEnter, onMouseLeave, className }) => (
    <button onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        Cancel Request
    </button>
);

const WaitingRequestButton = ({ onClick, onMouseEnter, onMouseLeave, className }) => (
    <button className={className + " friend-button-action"} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Image className={className + " image"} src="/clock.png" width={40} height={40} title="Requested" />
    </button>
);

const UnfriendButton = ({ onClick, onMouseEnter, onMouseLeave, className }) => (
    <button onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        Unfriend
    </button>
);

const AcceptRejectButton = ({ onClick, onMouseEnter, onMouseLeave, className }) => {
    return (
        <div className="friend-request">
            <button className={className + " friend-button-action" + " accept"} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                Accept
            </button>
            <button className={className + " friend-button-action" + " reject"} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
                Reject
            </button>
        </div>
    );
};

export default function FriendButton({ id }) {
    if (!id || typeof id !== "number") {
        throw new Error("tried to create a friend without a friend. what a LOSER");
    }

    const [friendshipStatus, setFriendshipStatus] = useState("not_friends");
    // ("not_friends | friends | pending | actionable");
    const [hovered, setHovered] = useState();

    const { meta } = useAuth();

    const getRequests = async () => {
        if (!meta.id) {
            return;
        }

        const u = meta.id;
        const t = id;

        const { data: outgoing, error: outer } = await supabase.from("friend_requests").select().eq("src", u).eq("dst", t);
        if (!outer) {
            if (outgoing.length) {
                setFriendshipStatus("requested");
                return;
            }
        }

        const { data: incoming, error: inert } = await supabase.from("friend_requests").select().eq("src", t).eq("dst", u);
        if (!inert) {
            if (incoming.length) {
                console.log("pending");
                setFriendshipStatus("pending");
                return;
            }
        }
    };

    const getFriendship = async () => {
        if (!meta.id) {
            return;
        }

        const u = meta.id;
        const t = id;

        const { data, error } = await supabase.from("friendships").select().or(`and(a.eq.${t},b.eq.${u}), and(a.eq.${u},b.eq.${t})`);
        if (!error) {
            if (data.length) {
                console.log("friends");

                setFriendshipStatus("friends");
            }
        }
    };

    useEffect(() => {
        if (meta) {
            getRequests();
            getFriendship();
        }
    }, [meta]);

    let ButtonComponent;
    switch (friendshipStatus) {
        case "not_friends":
            ButtonComponent = AddFriendButton;
            break;
        case "requested":
            ButtonComponent = WaitingRequestButton;
            break;
        case "pending":
            ButtonComponent = AcceptRejectButton;
            break;
        case "friends":
            ButtonComponent = UnfriendButton;
            break;
        case undefined:
            ButtonComponent = null;
            break;
        default:
            ButtonComponent = null;
    }

    const func = () => {
        switch (friendshipStatus) {
            default:
                console.log("sss");
        }
    };

    const hover = () => {
        //fuck it state
    };

    return (
        <div className="friend-button container">
            {ButtonComponent ? (
                <ButtonComponent
                    className=""
                    onClick={func}
                    onMouseEnter={() => {
                        setHovered(true);
                    }}
                    onMouseLeave={() => {
                        setHovered(false);
                    }}
                />
            ) : (
                <span className="error">No actions available</span>
            )}
        </div>
    );
}
