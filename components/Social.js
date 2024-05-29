import { useState, useEffect } from "react";
import { useAuth } from "./providers/AuthContext";
import { useModal } from "./providers/ModalContext";
import { supabase } from "../functions/SupabaseClient";
import RequestModal from "../components/modals/RequestModal";
import CommissionerShield from "./CommissionerShield";
import { useMobile } from "./providers/MobileContext";

function CommissionerElement({ commish /* int */ }) {
    const [commishInfo, setCommishInfo] = useState({});
    useEffect(() => {
        const abuseRLSAndGetCommishData = async () => {
            if (commish !== -1) {
                const { data, error } = await supabase.rpc("get_commish_data", { u: commish });
                setCommishInfo(data);
            }
        };

        abuseRLSAndGetCommishData();
    }, [commish]);

    return (
        <div className="commish" title="Commissioner">
            <div className="pic icon-parent">
                <img src={commishInfo.pfp_url} style={{ height: "50px", borderRadius: "50%", padding: "5px" }} />
                <CommissionerShield />
            </div>
            <div className="top-down">
                <div className="commish-name">{commishInfo.username}</div>
                <div className="commish-email">{commishInfo.display}</div>
            </div>
        </div>
    );
}

function GroupElement({ group, message }) {
    const { isMobile } = useMobile();

    const [joined, setJoined] = useState("Join Group"); //make this a string variable based on the status so requested already a member
    const [reqVis, setReqVis] = useState(false);

    const { meta } = useAuth();
    const { failed, succeed } = useModal();

    const [commish, setCID] = useState(-1);
    if (!group && !message) {
        // !a && !b == !(a||b) -- aside very cool little theorem
        throw new Error(`GroupElement cannot exist without parameters. \ngroup=${group}\nmessage=${message}`);
    }
    if (message) {
        if (message === "begin") {
            return (
                <div className="result">
                    <div className="message"></div>
                </div>
            );
        }
        return (
            <div className="result">
                <div className="message">{message}</div>
            </div>
        );
    }

    useEffect(() => {
        const getCommishData = async () => {
            const { data, error } = await supabase.from("commissioners").select("userID").eq("commissionerID", group.commissionerID).single();
            if (data) {
                setCID(data.userID);
            }
        };

        const getStatus = async () => {
            const { data: member, error: memError } = await supabase.from("user_groups").select().eq("groupID", group.groupID).eq("userID", meta.id);
            const { data: request, error: reqError } = await supabase.from("requests").select().eq("group_id", group.groupID).eq("user_id", meta.id);

            if (request && request.length === 1) {
                setJoined("Requested");
            }
            if (member && member.length === 1) {
                setJoined("Already a member");
            }
        };

        getCommishData();
        getStatus();
    }, [group]);

    const makeRequest = async () => {
        const { error } = await supabase.from("requests").insert({ user_id: meta.id, group_id: group.groupID }); //ths line was so scuffed
        if (error) {
            failed(error);
        } else {
            setReqVis(false);
            succeed();
            setJoined("Requested");
        }
    };
    return (
        <div className="result">
            <div className="group" style={isMobile ? mobileStyle.contained : {}}>
                <div className="group-name">{group.groupName}</div>
                <div className="comm-container" style={isMobile ? mobileStyle.contained : {}}>
                    <CommissionerElement commish={commish} />
                </div>
                <button
                    className={`insert-button`}
                    disabled={joined !== "Join Group"}
                    style={joined !== "Join Group" ? { backgroundColor: "var(--form-input)", cursor: "not-allowed" } : {}}
                    onClick={() => setReqVis(true)}
                >
                    {joined}
                </button>
            </div>
            <RequestModal
                isOpen={reqVis}
                onClose={() => {
                    setReqVis(false);
                }}
                group={group.groupName}
                onConfirm={makeRequest}
            />
        </div>
    );
}

export default function Social() {
    let cook; //this'll come into play fsfs

    const { isMobile, height, width } = useMobile();
    const elementWidth = `${Math.min(height, width) - 20}px`;

    //stateful function...
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const getGroupsByQuery = async () => {
            if (query) {
                const { data } = await supabase.from("groups").select().ilike("groupName", `${query}*`);
                if (data) {
                    setResults(data);
                }
            } else {
                setResults([]);
            }
        };
        getGroupsByQuery();
    }, [query]);

    //i love functional programming

    return (
        <div className="page social">
            <div className="search-groups search-container" style={isMobile ? { width: elementWidth } : {}}>
                <input className="search-bar" placeholder="search groups..." value={query} onChange={(e) => setQuery(e.target.value)} />
                <img style={{ height: "32px" }} src="/search.png" />
            </div>
            <div className="social-results" style={isMobile ? { width: elementWidth, marginTop: 0 } : {}}>
                {results && results.length ? (
                    results.map((group, index) => {
                        return <GroupElement group={group} key={index} />;
                    })
                ) : !query.length ? (
                    <GroupElement message="begin" />
                ) : (
                    <GroupElement message="No groups found. :(" />
                )}
            </div>
        </div>
    );
}

const mobileStyle = {
    searchBar: {
        width: "calc(100% - 20px)",
    },
    results: {
        width: "calc(100% - 20px)",
    },
    topDown: {
        width: "calc(100% - 70px)",
    },
    contained: {
        maxWidth: "100%",
    },
};
