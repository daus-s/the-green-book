import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../../functions/SupabaseClient"; //hahah
import { decode } from "../../../../functions/Encode";
import MastersPlaceBetForm from "../../../../components/MastersBetPlaceForm";
import { useAuth } from "../../../../components/providers/AuthContext";
import { usePlayer } from "../../../../components/providers/PlayerContext";
import Loading from "../../../../components/Loading";
import { truthy } from "../../../../dev/truthy";

export default function MasterBet() {
    //copypasta half the code from MastersPlaceBetForm.js
    //preload the data
    const [bet, setBet] = useState(undefined);
    const { meta } = useAuth();
    const { t, g, players, alternates, mode, tour } = usePlayer();

    const router = useRouter();

    const getBarbenlighter = async (leagueID) => {
        if (meta?.id) {
            console.log(leagueID, meta.id);
            console.log(decode(leagueID));
            const { data, error } = await supabase.from("masters_league").select().eq("league_id", decode(leagueID)).eq("public_id", meta.id).single();
            console.log(data ? data : error);
            if (!error) {
                console.log("setting data");
                setBet(data);
            } else {
                if (typeof window !== "undefined" && router) {
                    router.push(`/pga/${router.query.tournament}/place`);
                }
            }
        }
    };

    const getOppenheimer = async (oppID) => {
        if (meta?.id) {
            console.log(decode(oppID));
            const { data, error } = await supabase.from("masters_opponents").select().eq("oppie", decode(oppID)).eq("public_id", meta.id).single();
            if (!error) {
                setBet(data);
            } else {
                if (typeof window !== "undefined" && router) {
                    router.push(`/pga/${router.query.tournament}/place`);
                }
            }
        }
    };

    useEffect(() => {
        if (router.query.enc?.charAt(0) === "$") {
            console.log("getting league");
            console.log(router.query.enc.substring(1, router.query.enc.length));
            getBarbenlighter(router.query.enc.substring(1, router.query.enc.length));
        }
        if (router.query.enc?.charAt(0) === "@") {
            console.log("getting 1v1");
            console.log(router.query.enc.substring(1, router.query.enc.length));
            getOppenheimer(router.query.enc.substring(1, router.query.enc.length));
        }
    }, [router, meta]);

    // console.log("bet: ", bet);
    // console.log("lenght: ", players?.length == 4, "\n", players);
    // console.log("mode:", mode);
    // console.log("length 2:", mode === "Opponent" ? alternates?.length == 4 : true);
    // console.log("them or group:", t ? t : g ? g : false);
    console.log(bet, Boolean(bet));
    console.log(tour, Boolean(tour));
    console.log(players, Boolean(players?.length));
    console.log(mode, Boolean(mode));
    console.log(mode, alternates, Boolean(mode === "Opponent" ? alternates?.length == 4 : true));
    console.log(Boolean(t || g));
    console.log(truthy(bet && tour && players?.length == 4 && mode && (mode === "Opponent" ? alternates?.length == 4 : true) && (t || g)));
    return (
        <div className="golf-bet page">
            <a className="return" href={"/pga/" + router.query.tournament}>
                {"<"} Return to Masters dashboard
            </a>
            {bet && tour && players?.length == 4 && mode && (mode === "Opponent" ? alternates?.length == 4 : true) && (t || g) ? (
                <MastersPlaceBetForm payload={{ bet, players, alternates, opp: t, league: g, mode }} />
            ) : (
                <Loading />
            )}
        </div>
    );
}
