import React, { createContext, useContext, useEffect, useState } from "react";
import { getGolfers } from "../../functions/GetGolfers";
import { useRouter } from "next/router";
import { supabase } from "../../functions/SupabaseClient";

const TournamentContext = createContext();

export const useTournament = () => useContext(TournamentContext);

// the modal provider provides the failure and success modals frequently used in componentns
// each will have a function to make the modal visible
export const TournamentProvider = ({ children }) => {
    //provide 2 modals through this component
    const [optional, setOptional] = useState(undefined);
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
        } else if (optional) {
            const { data: tournament, error: strawberry } = await supabase.from("tournaments").select().eq("id", optional).single();
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
                setGolfers(data);
            } else {
            }
        }
        setDownloading(false);
    };

    useEffect(() => {
        getTournament();
    }, [router, optional]);

    useEffect(() => {
        ggs();
        const intervalId = setInterval(ggs, 60000);
        return () => clearInterval(intervalId);
    }, [tournament]);

    return <TournamentContext.Provider value={{ tournament, golfers, downloading, setOptional }}>{children}</TournamentContext.Provider>;
};
