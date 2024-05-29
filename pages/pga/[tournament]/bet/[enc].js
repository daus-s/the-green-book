import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { supabase } from "../../../../functions/SupabaseClient"; //hahah
import { decode } from "../../../../functions/Encode";
import MastersPlaceBetForm from "../../../../components/MastersBetPlaceForm";
import { useAuth } from "../../../../components/providers/AuthContext";
import { usePlayer } from "../../../../components/providers/PlayerContext";
import Loading from "../../../../components/Loading";

export default function MasterBet() {
    //copypasta half the code from MastersPlaceBetForm.js
    //preload the data
    const [bet, setBet] = useState(undefined);
    const { meta } = useAuth();
    const { t, g, players, alternates, mode, tour } = usePlayer();

    const router = useRouter();

    const getBarbenlighter = async (leagueID) => {
        if (meta?.id) {
            const { data, error } = await supabase.from("masters_league").select().eq("league_id", decode(leagueID)).eq("public_id", meta.id).single();
            if (!error) {
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
