import React, { useEffect, useState } from "react";
import Image from "next/image";

import { supabase } from "../functions/SupabaseClient";
import { commute } from "../functions/SetTheory";

import { useAuth } from "./providers/AuthContext";
import { useModal } from "./providers/ModalContext";

const Friends = ({ className, remove, u, t }) => {
    const [hovered, setHovered] = useState(false);

    const unfriend = async () => {
        const { data, error } = await supabase.from("friendships").delete().or(commute(u, t)).select();
        if (!error && data.length) {
            remove();
        }
    };

    return (
        <button
            className={`${className ? className : ""} friend-button-action ${hovered ? "unfriend" : ""}`}
            onClick={hovered ? () => unfriend() : null}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Image
                className={`${className ? className : ""} image`}
                src={hovered ? "/unfriend.png" : "/friend.png"}
                width={40}
                height={40}
                title={hovered ? "Unfriend" : "Friends"}
                style={hovered ? { transform: "translateY(1px)" } : {}}
            />
        </button>
    );
};

const NotFriends = ({ className, request, t, u }) => {
    const { failed } = useModal();
    const makeFriendRequest = async () => {
        const { error } = await supabase.from("friend_requests").insert({
            src: u,
            dst: t,
        });
        if (!error) {
            request();
        } else {
            failed({ code: 11111 });
        }
    };

    return (
        <button className={(className ? className : "") + " friend-button-action add"} onClick={makeFriendRequest} style={{ padding: "10px 10px 5px 10px" }}>
            <Image className={(className ? className : "") + " image"} src="/addfriend.png" width={40} height={40} />
        </button>
    );
};
const Requested = ({ className, cancel, u, t }) => {
    const [hovered, setHovered] = useState(false);

    const cancelRequest = async () => {
        console.log("what");
        console.log(u, t);
        if (!(u && t)) {
            return;
        }
        const { error } = await supabase.from("friend_requests").delete().eq("src", u).eq("dst", t);
        if (!error) {
            cancel();
        }
    };

    return (
        <button
            className={`${className ? className : ""} friend-button-action ${hovered ? "cancel" : ""}`}
            onClick={hovered ? () => cancelRequest() : null}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ padding: hovered ? "11px 11px 6px 11px" : "" }}
        >
            <Image
                className={`${className ? className : ""} image`}
                src={hovered ? "/cancel.png" : "/clock.png"}
                width={hovered ? 38 : 40}
                height={hovered ? 38 : 40}
                title={hovered ? "Cancel Request" : "Requested"}
            />
        </button>
    );
};

const Pending = ({ className, newStatus, u, t }) => {
    const accept = async () => {
        console.log("aaaaaaaaaaaaa");
        const { data, error } = await supabase.rpc("accept_fr", {
            d: u,
            s: t,
        });
        console.log("data:", data, "error:", error);
        if (!error && !data) {
            //data is 0 if success
            newStatus("not_friends");
        }
        if (!error) {
            newStatus("friends");
        }
    };

    const reject = async () => {
        console.log("aaaaaaaaaaaaa");

        const { data, error } = await supabase.rpc("reject_fr", {
            d: u,
            s: t,
        });
        console.log("data:", data, "error:", error);

        if (!error && !data) {
            //data is 0 if success
            newStatus("not_friends");
        }
    };

    return (
        <div className="fba friend-request">
            <button className={(className ? className : "") + " friend-button-action" + " accept"} onClick={accept}>
                Accept
            </button>
            <button className={(className ? className : "") + " friend-button-action" + " reject"} onClick={reject}>
                Reject
            </button>
        </div>
    );
};

export default function FriendStatus({ id }) {
    if (!id || typeof id !== "number") {
        throw new Error("tried to create a friend without a friend. what a LOSER");
    }

    const [friends, setFriends] = useState(undefined);
    const [requested, setRequested] = useState(undefined);
    const [pending, setPending] = useState(undefined);

    /** ("not_friends | friends | pending | requested"); */
    const [friendshipStatus, setFriendshipStatus] = useState(undefined);
    const [btn, setBtn] = useState(<span style={{ height: "32px" }} />);

    const { meta } = useAuth();

    const getFriendship = async () => {
        if (!meta.id) {
            return;
        }

        const u = meta.id;
        const t = id;

        const { data, error } = await supabase.from("friendships").select().or(commute(u, t));
        if (!error) {
            if (data.length) {
                console.log("friends");

                setFriends(true);
                setFriendshipStatus("friends");
            } else {
                console.log("not friends");
                setFriends(false);
            }
        }
    };

    const getRequests = async () => {
        if (!meta.id) {
            return;
        }

        const u = meta.id;
        const t = id;

        const { data: outgoing, error: outer } = await supabase.from("friend_requests").select().eq("src", u).eq("dst", t);
        if (!outer) {
            if (outgoing.length) {
                setRequested(true);
                setPending(false); //include this bc u cant make it to the next part to set the
                return;
            }
            setRequested(false);
        }

        const { data: incoming, error: inert } = await supabase.from("friend_requests").select().eq("src", t).eq("dst", u);
        if (!inert) {
            if (incoming.length) {
                setPending(true);
                return;
            } else {
                setPending(false);
            }
        }
    };

    useEffect(() => {
        if (pending === true && friends === false && requested === false) {
            setFriendshipStatus("pending");
        }
        if (requested === true && pending === false && friends === false) {
            setFriendshipStatus("requested");
        }
        if (friends === true && pending === false && requested === false) {
            setFriendshipStatus("friends");
        }
        if (pending === false && friends === false && requested === false) {
            setFriendshipStatus("not_friends");
        }
    }, [pending, friends, requested]);

    useEffect(() => {
        if (meta) {
            getRequests();
            getFriendship();
        }
    }, [meta]);

    useEffect(() => {
        switch (friendshipStatus) {
            case "not_friends":
                setBtn(<NotFriends className={"add-friend-button"} request={() => setRequested(true)} t={id} u={meta?.id} />);
                break;
            case "requested":
                setBtn(<Requested className={"waiting-response-button"} t={id} u={meta?.id} cancel={() => setFriendshipStatus("not_friends")} />);
                break;
            case "pending":
                setBtn(<Pending className={"waiting-user-action"} newStatus={setFriendshipStatus} t={id} u={meta?.id} />);
                break;
            case "friends":
                setBtn(<Friends className={"friends"} t={id} u={meta?.id} remove={() => setFriendshipStatus("not_friends")} />);
                break;
            case undefined:
                setBtn(<span style={{ height: "60px" }} />);
                break;
            default:
                setBtn(<span style={{ height: "60px" }} />);
                break;
        }
    }, [friendshipStatus]);

    const hover = () => {
        //fuck it state
    };

    return <div className="friend-button container">{btn}</div>;
}
