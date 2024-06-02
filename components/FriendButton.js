import React, { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { supabase } from "../functions/SupabaseClient";

const AddFriendButton = ({ onClick, onMouseEnter, onMouseLeave }) => (
    <button onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        Add Friend
    </button>
);

const CancelRequestButton = ({ onClick, onMouseEnter, onMouseLeave }) => (
    <button onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        Cancel Request
    </button>
);

const RetractRequestButton = ({ onClick, onMouseEnter, onMouseLeave }) => (
    <button onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        Retract Request
    </button>
);

const UnfriendButton = ({ onClick, onMouseEnter, onMouseLeave }) => (
    <button onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        Unfriend
    </button>
);

export default function FriendButton({ id }) {
    const [friendshipStatus, setFriendshipStatus] = useState("friends");
    // ("not_friends | friends | waiting");
    const [hovered, setHovered] = useState(false);

    const { meta } = useAuth();

    const getRequests = async () => {
        const { data, error } = await supabase.from("friend_requests");
        if (!error) {
        }
    };

    const getFriendship = async () => {
        const { data, error } = await supabase.from("friendships").select().or(`a.eq.${id}, b.eq.${id}`).or(`a.eq.${meta?.id}, b.eq.${meta?.id}`);
        if (!error) {
            console.log(data);
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
            ButtonComponent = CancelRequestButton;
            break;
        case "retracted":
            ButtonComponent = RetractRequestButton;
            break;
        case "friends":
            ButtonComponent = UnfriendButton;
            break;
        default:
            ButtonComponent = null;
    }

    const func = () => {
        //
        switch (friendshipStatus) {
            default:
                console.log("sss");
        }
    };

    const hover = () => {
        //fuck it state
    };

    return (
        <div className="friend-button status">
            {ButtonComponent ? (
                <ButtonComponent
                    onClick={func}
                    onMouseEnter={() => {
                        setHovered(true);
                    }}
                    onMouseLeave={() => {
                        setHovered(false);
                    }}
                />
            ) : (
                <span>No action available</span>
            )}
        </div>
    );
}
