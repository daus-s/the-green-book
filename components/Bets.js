import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useMobile } from "./providers/MobileContext";

import { supabase } from "../functions/SupabaseClient";
import Link from "next/link";
import Loading from "./Loading";
import PGAAd from "./PGAAdBet";
import CreateBetIcon from "./CreateBetIcon";
import { useBets } from "./providers/BetProvider";
import Bet2 from "./Bet2";

export default function Bets() {
    const [loading, setLoading] = useState(true);
    const { user, session } = useAuth();
    const { isMobile } = useMobile();

    const { bets: bets2 } = useBets();

    const [bets, setBets] = useState([]);

    useEffect(() => {
        const getBets = async () => {
            //public id
            if (user && user.id) {
                const pid = await supabase.from("users").select("publicID").eq("userID", user.id).single();
                if (pid.data) {
                    // now get the users groups
                    const groups = await supabase.from("user_groups").select("groupID").eq("userID", pid.data.publicID);
                    let groupIDs = [];
                    groups.data?.forEach((group) => {
                        groupIDs.push(group.groupID);
                    });
                    const betList = [];
                    for (const id of groupIDs) {
                        const { data, error } = await supabase.from("bets").select().eq("groupID", id).eq("open", true).order("creationtime", { ascending: false }); //TODO: change this to recent_edit_time, and add to db
                        if (!error && data) {
                            data.forEach((bet) => {
                                betList.push(bet);
                            });
                        }
                    }
                    setBets(betList);
                    setLoading(false);
                }
            }
        };

        getBets();
    }, [user, session]);

    return (
        <div className="bets page">
            <CreateBetIcon />
            <PGAAd />
            {loading ? (
                <Loading />
            ) : bets.length + bets2?.length ? (
                <>
                    {bets2.map((b) => {
                        return <Bet2 bet={b} />;
                    })}
                </>
            ) : (
                <div className="find-groups" style={isMobile ? mobileStyle.empty : {}}>
                    <Link href="/social">Join groups to bet with friends!</Link>
                </div>
            )}
        </div>
    );
}

const mobileStyle = {
    empty: {
        fontSize: "18px",
        width: "50%",
    },
};
