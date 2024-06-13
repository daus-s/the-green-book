import React, { createContext, useContext, useEffect, useState } from "react";
import { getGolfers } from "../../functions/GetGolfers";
import { useRouter } from "next/router";
import { supabase } from "../../functions/SupabaseClient";

const TournamentContext = createContext();

export const useTournament = () => useContext(TournamentContext);

// the modal provider provides the failure and success modals frequently used in componentns
// each will have a function to make the modal visible
export const TourProvider = ({ children }) => {
    //provide 2 modals through this component
    const [tournament, setTournament] = useState(undefined);
    const [golfers, setGolfers] = useState(undefined);
    const [downloading, setDownloading] = useState(false);

    const router = useRouter();

    const getTournament = async () => {
        if (router.query.tournament) {
            const { data: tournament, error: strawberry } = await supabase.from("tournaments").select().eq("extension", router.query.tournament).single();
            if (!strawberry && tournament) {
                setTournament(tournament);
            }
        }
    };
    //named ggs to not overrdie getGolfers imported
    const ggs = async () => {
        setDownloading(true);
        if (tournament) {
            const { data, error } = await getGolfers(tournament);
            if (!error) {
                //console.log('setting Golfers literally right now');
                setGolfers(data);
            } else {
            }
        }
        setDownloading(false);
    };

    useEffect(() => {
        getTournament();
    }, [router]);

    useEffect(() => {
        ggs();
        const intervalId = setInterval(ggs, 60000);
        return () => clearInterval(intervalId);
    }, [tournament]);

    return <TournamentContext.Provider value={{ tournament, golfers, downloading }}>{children}</TournamentContext.Provider>;
};
