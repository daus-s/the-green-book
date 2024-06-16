import Image from "next/image";
import ProfilePopout from "../ProfilePopout";
import { use, useEffect, useRef, useState } from "react";
import { supabase } from "../../functions/SupabaseClient";
import { useMobile } from "../providers/MobileContext";

export default function FriendRequestNotification({ notification, locallyViewed, setLocallyViewed }) {
    const [candidate, setCandidate] = useState(undefined);
    const [hardscope, setHardscope] = useState(false);
    const [modalStyle, setModalStyle] = useState({});

    const { width, height } = useMobile();

    const [i, setI] = useState(false);

    const ref = useRef(null);
    const innerRef = useRef(null);

    const accept = async () => {
        const { data, error } = await supabase.rpc("accept_fr", {
            d: notification.dst,
            s: notification.src,
        });
        if (!error && !data) {
            notification.viewed = 1;
        }
    };

    const reject = async () => {
        const { data, error } = await supabase.rpc("reject_fr", {
            d: notification.dst,
            s: notification.src,
        });
        if (!error && !data) {
            notification.viewed = -1;
        }
    };

    const getSrcAndDst = async () => {
        const { data, error } = await supabase.from("public_users").select().eq("id", notification.src).single();
        if (!error && data) {
            setCandidate(data);
        }
    };

    const openModal = () => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setModalStyle({
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`,
                position: "absolute",
            });
        }
        setHardscope(true);
        setI(true);
    };

    useEffect(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setModalStyle({
                top: `${rect.bottom + window.scrollY}px`,
                left: `${rect.left + window.scrollX}px`,
                position: "absolute",
            });
        }
    }, [width, height]);

    useEffect(() => {
        getSrcAndDst();
    }, []);

    useEffect(() => {
        if (!i) {
            setHardscope(false);
        }
    }, [i]);

    useEffect(() => {
        if (!hardscope) {
            setI(false);
        }
    }, [hardscope]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (hardscope && innerRef.current && !innerRef.current.contains(event.target)) {
                setI(false);
            }
        }

        window.addEventListener("click", handleClickOutside);
        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, [hardscope]);

    return (
        <>
            <div className={"notification friend-request " + (notification.viewed || locallyViewed ? "" : " new")} onMouseEnter={() => setLocallyViewed(true)} ref={ref}>
                <div className="message">
                    <Image src={candidate?.pfp_url ? candidate.pfp_url : "/user.png"} width={48} height={48} alt="user asking to be your friend" style={{ borderRadius: "24px", cursor: "pointer" }} />
                    <div>
                        <span style={{ fontWeight: 600, marginRight: 3, cursor: "pointer" }} onClick={openModal}>
                            {candidate?.display}
                        </span>{" "}
                        wants to be friends.
                    </div>
                </div>
                <div className="buttons">
                    <button className="accept" onClick={accept}>
                        accept
                    </button>
                    <button className="reject" onClick={reject}>
                        reject
                    </button>
                </div>
            </div>
            {i && hardscope && candidate ? <ProfilePopout user={candidate} style={modalStyle} ref={innerRef} /> : <></>}
        </>
    );
}
