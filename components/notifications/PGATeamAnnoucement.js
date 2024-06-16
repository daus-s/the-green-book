import { useEffect, useState } from "react";
import { useTournament } from "../providers/TournamentContext";

import { golferViaIndex } from "../../functions/GolfFunctions";
import { partition, warn } from "../../functions/RandomBigInt";
import { supabase } from "../../functions/SupabaseClient";
import { encode } from "../../functions/Encode";

import Link from "next/link";
import Image from "next/image";

//use notification.optional;

export default function PGATeamAnnouncement({ notification, locallyViewed, setLocallyViewed }) {
    const { golfers, tournament, setOptional } = useTournament();
    const [mode, setMode] = useState(undefined);
    const [tps, setTPS] = useState(undefined);
    const [team, setTeam] = useState(partition(notification.value));

    const getOptions = async () => {
        const { data, error } = await supabase.from("notification_options").select("options").eq("id", notification.id).single(); // i think its fine, may need to be changed to rpc
        if (!error && data) {
            let value = BigInt(data?.options);
            if (typeof value === "undefined") {
                throw new Error("created an unbalanced notification. how and why?");
            }
            warn(data.options);
            const tid = Number((value & 0x0000ffff00000000n) >> 32n);
            setOptional(tid);
            console.log("tournament:", tid);

            const mode = Number((value >> 48n) & 0xffffn);
            setMode(mode);
            console.log("mode:", mode);

            const group = Number(value & 0x00000000ffffffffn);
            setTPS(group);
            console.log("group:", encode(group));
        }
        if (error) {
            throw new Error("created an unbalanced notification. how and why?");
        }
    };

    useEffect(() => {
        getOptions();
    }, []);

    return (
        <div className={"notification" + (notification.viewed || locallyViewed ? "" : " new")} onMouseEnter={() => setLocallyViewed(true)}>
            Your team for the {tournament.tournament_name} is {golferViaIndex(team[0], golfers).name}, {golferViaIndex(team[1], golfers).name}, {golferViaIndex(team[2], golfers).name},{" "}
            {golferViaIndex(team[3], golfers).name}.
            <br /> <Link href={`/pga/${tournament?.extension}/bet/${mode ? "$" : "@" + encode(tps ? tps : "")}`}>View bet</Link>
            <Image src="/arrow.png" width={32} height={32} style={{ transform: "rotate(-90deg)" }} />
        </div>
    );
}

// //    const link = "/pga/%s/%s";
// if (notification.dst) {
//     //1v1 bet
//     link.concat("@");
//     link.concat();
// } else if (notification.dst === null) {
//     link.concat("$");
// }
