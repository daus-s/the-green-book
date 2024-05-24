import Link from "next/link";
import { supabase } from "../functions/SupabaseClient";
import { useEffect, useState } from "react";

export default function PGAAd() {
    const [hover, setHover] = useState(false);
    const [tournament, setTournament] = useState(undefined);
    const getNextTournament = async () => {
        const { data, error } = await supabase.from("tournaments").select().gt("cut_time", new Date().toISOString()).order("cut_time").limit(1);
        if (!error && data.length) {
            setTournament(data[0]);
        }
    };

    useEffect(() => {
        getNextTournament();
    }, []);

    if (tournament) {
        return (
            <Link className="pgaad bet" href="/pga" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                <img className="pga" src="/pga.png" style={{ height: "105px" }} />
                <div className={"tt" + (hover ? " hover" : "")}>{tournament?.tournament_name}</div>
                {/* {JSON.stringify(tournament)} */}
                <div className="invite">
                    Bet now
                    <img src="/arrow.png" style={{ height: "20px", transform: "rotate(-90deg)" }} />
                </div>
            </Link>
        );
    } else {
        return <></>;
    }
}

/*
<div className="options bet" style={isMobile?{width: elementWidth}:{}}>
<h3
  style={{
    maxWidth: "320px",
    position: "relative",
    left: "8%",
    width: "70%",
    textAlign: "left",
    ...isMobile?mobileStyle.header:{}
  }}
>
  {title}
</h3>*/
