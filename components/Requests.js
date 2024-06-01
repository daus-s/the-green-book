import { useEffect, useState } from "react";
import { useMobile } from "./providers/MobileContext";
import { supabase } from "../functions/SupabaseClient";
import { useModal } from "./providers/ModalContext";
import ADModal from "./modals/ADModal";
import User from "./User";

export default function Requests({ groupID, groupName, setCount }) {
    // const [found, setFound] = useState({})
    const [rs, setRS] = useState([]);
    const [x, setX] = useState(0);
    const [face, setFace] = useState({});

    const [adVis, setADVis] = useState(false);
    const [approve, setApprove] = useState(undefined);

    const { succeed, failed } = useModal();
    const { isMobile } = useMobile();

    useEffect(() => {
        const getRequests = async () => {
            const { data, error } = await supabase.from("requests").select("user_id").eq("group_id", groupID);
            if (data && data.length > 0) {
                setRS(data);
                setCount ? setCount(data.length) : () => {}; //what the fuck
            }
        };
        getRequests();
    }, []);

    useEffect(() => {
        const getUserData = async () => {
            if (rs.length > x) {
                const { data, error } = await supabase.from("public_users").select().eq("id", rs[x]?.user_id).single();
                if (data) {
                    setFace(data);
                }
            }
        };

        getUserData();
    }, [x, rs]);

    const accept = async () => {
        const { data, error } = await supabase.rpc("accept_request", { _user: face.id, _group: groupID });
        if (data == 0) {
            succeed();
        } else {
            failed(data ? data : error ? error : null);
        }
        setADVis(false);
        window.location.replace(location.href);
    };

    const reject = async () => {
        const { error } = await supabase.from("requests").delete().eq("user_id", face.id).eq("group_id", groupID);
        if (error) {
            failed(error);
        } else {
            succeed();
        }
        setADVis(false);
        window.location.replace(location.href);
    };

    const handleAxion = (type) => {
        if (type === "accept") {
            setApprove(true);
        } else if (type === "reject") {
            setApprove(false);
        }
        setADVis(true);
    };

    return (
        <>
            <div className="req-nav-div" style={isMobile ? { width: "100%" } : {}}>
                <div className="left" onClick={() => setX((prv) => (prv - 1) % rs.length)}>
                    <img src="/left.png" style={isMobile ? { width: "20px", height: "20px" } : {}} />
                </div>
                <div className="request" style={isMobile ? { width: "235px" } : {}}>
                    {rs.length ? (
                        <User user={face} />
                    ) : (
                        <div className="no-results" style={isMobile ? { width: "235px" } : {}}>
                            No Requests
                            {/* in here add the little notification element*/}
                        </div>
                    )}
                </div>
                <div className="right" onClick={() => setX((prv) => (prv + 1) % rs.length)}>
                    <img src="/right.png" />
                </div>
            </div>
            {rs.length ? (
                <div className="decision-box" style={isMobile ? { paddingLeft: "0px", width: "100%", padding: "10px 32.5px 2px 32.5px" } : {}}>
                    <div className="accept" onClick={() => handleAxion("accept")}>
                        <img src="/accept.png" title="Accept" />
                        <div className="text">Accept</div>
                    </div>
                    <div className="reject" onClick={() => handleAxion("reject")}>
                        <img src="/remove.png" title="Reject" />
                        <div className="text">Reject</div>
                    </div>
                </div>
            ) : (
                <></>
            )}
            <ADModal isOpen={adVis} onClose={() => setADVis(false)} onConfirm={approve ? accept : reject} approve={approve ? approve : false} guest={face} groupName={groupName} />
        </>
    );
}
