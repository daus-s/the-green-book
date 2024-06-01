import { useEffect, useState } from "react";
import { useMobile } from "./providers/MobileContext";
import { supabase } from "../functions/SupabaseClient";
import { useModal } from "./providers/ModalContext";
import CommishModal from "./modals/CommishModal";
import User from "./User";

export default function CommishRequests({ setCount }) {
    const [rs, setRS] = useState([]);
    const [x, setX] = useState(0);
    const [face, setFace] = useState({});

    const [adVis, setADVis] = useState(false);
    const [approve, setApprove] = useState(undefined);

    const { succeed, failed } = useModal();
    const { isMobile } = useMobile();

    useEffect(() => {
        const getRequests = async () => {
            const { data, error } = await supabase.from("commissioning").select().order("created_at");
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
                const { data: publicID, error: publicError } = await supabase.from("users").select("publicID").eq("userID", rs[x]?.id).single();
                if (!publicError) {
                    const { data, error } = await supabase.from("public_users").select().eq("id", publicID.publicID).single();
                    if (data) {
                        setFace(data);
                    }
                }
            }
        };

        getUserData();
    }, [x, rs]);

    const accept = async () => {
        const { data: update, error: errCheck } = await supabase.from("users").update({ commissioner: true }).eq("userID", rs[x]?.id);
        if (!errCheck) {
            const { data: insert, error: insCheck } = await supabase.from("commissioners").insert({ userID: rs[x].id });
            if (insCheck) {
                const { data: unUpdate } = await supabase.from("users").update({ commissioner: false }).eq("userID", rs[x].id);
            } else {
                const { data, error } = await supabase.from("commissioning").delete().eq("id", rs[x].id);
                if (!error) {
                    succeed();
                } else {
                    failed(error.code);
                }
            }
        } else {
            failed(error.code);
        }
        setADVis(false);
        const shallow = [...rs];
        shallow.splice(x, 1);
        if (x !== 0) {
            setX((i) => i - 1);
        }
        setRS(shallow);
        setCount((prev) => prev - 1);
    };

    const reject = async () => {
        const { error } = await supabase.from("commissioning").delete().eq("id", rs[x]?.id);
        if (error) {
            failed(error);
        } else {
            succeed();
        }
        setADVis(false);
        const shallow = [...rs];
        shallow.splice(x, 1);
        if (x !== 0) {
            setX((i) => i - 1);
        }
        setRS(shallow);
        setCount((prev) => prev - 1);
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
        <div className="commish requests admin-child">
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
            <CommishModal isOpen={adVis} onClose={() => setADVis(false)} onConfirm={approve ? accept : reject} approve={approve ? approve : false} guest={face} />
        </div>
    );
}
