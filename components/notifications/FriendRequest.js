import Image from "next/image";
import ProfilePopout from "../ProfilePopout";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../../functions/SupabaseClient";
import { useMobile } from "../providers/MobileContext";

export default function FriendRequestNotification({ notification, locallyViewed, setLocallyViewed }) {
    const [candidate, setCandidate] = useState(undefined);
    const [hardscope, setHardscope] = useState(false);
    const [modalStyle, setModalStyle] = useState({});

    const { width, height } = useMobile();

    const ref = useRef(null);

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
    return (
        <>
            <div className={"notification friend-request " + (notification.viewed || locallyViewed ? "" : "new")} onMouseEnter={() => setLocallyViewed(true)} ref={ref}>
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
                    <button className="accept">accept</button>
                    <button className="reject">reject</button>
                </div>
            </div>
            {hardscope && candidate ? <ProfilePopout user={candidate} style={modalStyle} /> : <></>}
        </>
    );
}
