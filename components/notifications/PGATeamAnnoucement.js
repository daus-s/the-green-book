import { useEffect, useState } from "react";
import { useTournament } from "../providers/TournamentContext";

import { golferViaIndex } from "../../functions/GolfFunctions";
import { partition, warn } from "../../functions/RandomBigInt";
import { supabase } from "../../functions/SupabaseClient";
import { encode } from "../../functions/Encode";

import Link from "next/link";
import Image from "next/image";
import Loading from "../Loading";

//use notification.optional;

export default function PGATeamAnnouncement({ notification, locallyViewed, setLocallyViewed }) {
    const { golfers, tournament, setOptional } = useTournament();
    const [mode, setMode] = useState(undefined);
    const [tps, setTPS] = useState(undefined);
    const team = partition(notification.value);

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

            const id = Number(value & 0x00000000ffffffffn);
            const { data: thirdPartyData, error: thirdPartyError } = await supabase
                .from(mode ? "groups" : "public_users")
                .select()
                .eq(mode ? "groupID" : "id", id)
                .single();
            if (!thirdPartyError) {
                setTPS(thirdPartyData);
                console.log("group:", encode(id));
            }
        }
        if (error) {
            throw new Error("created an unbalanced notification. how and why?");
        }
    };

    useEffect(() => {
        getOptions();
    }, []);

    if (golfers && tournament && team && team.length === 4 && tps && (mode === 1 || mode === 0)) {
        console.log(tps);
        if (mode) {
            //league
            return (
                <div className={"notification" + (notification.viewed || locallyViewed ? "" : " new")} onMouseEnter={() => setLocallyViewed(true)}>
                    Your fantasy team in the league <span style={{ fontWeight: "600" }}>{tps.groupName}</span> in for the {tournament?.tournament_name} is {golferViaIndex(team[0], golfers).name},{" "}
                    {golferViaIndex(team[1], golfers).name}, {golferViaIndex(team[2], golfers).name}, {golferViaIndex(team[3], golfers).name}.
                    <br />
                    <div className="link-div" style={{ display: "flex", alignItems: "center", height: "24px", marginTop: "5px" }}>
                        <Link href={`/pga/${tournament?.extension}/bet/${(mode ? "$" : "@") + encode(tps[mode ? "groupID" : "id"])}`} style={{ color: "var(--link-color)" }}>
                            View bet
                        </Link>
                        <Image src="/arrow.png" width={24} height={24} style={{ transform: "rotate(-90deg)" }} />
                    </div>
                </div>
            );
        } else {
            //head to head
            return (
                <div className={"notification" + (notification.viewed || locallyViewed ? "" : " new")} onMouseEnter={() => setLocallyViewed(true)}>
                    You drafted {golferViaIndex(team[0], golfers).name}, {golferViaIndex(team[1], golfers).name}, {golferViaIndex(team[2], golfers).name}, and {golferViaIndex(team[3], golfers).name}.
                    <br />
                    <div className="link-div" style={{ display: "flex", alignItems: "center", height: "24px", marginTop: "5px" }}>
                        <Link href={`/pga/${tournament?.extension}/bet/${(mode ? "$" : "@") + encode(tps)}`} style={{ color: "var(--link-color)" }}>
                            View bet
                        </Link>
                        <Image src="/arrow.png" width={24} height={24} style={{ transform: "rotate(-90deg)" }} />
                    </div>
                </div>
            );
        }
    } else {
        return (
            <div className={"notification" + (notification.viewed ? "" : " new")} style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "139px" }}>
                <Loading style={{ filter: "brightness(150%)", margin: "0 auto" }} />
            </div>
        );
    }
}
