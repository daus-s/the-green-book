import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../../functions/SupabaseClient";

const BetContext = createContext();

//ensure that this is nested within auth provider in _providers.js
export const BetProvider = ({ children }) => {
    const [bets, setBets] = useState(null);

    const { meta } = useAuth();

    const getBets = async () => {
        if (!meta.id) {
            return;
        }
        const { data, error } = await supabase.from("bets2").select("*, options(*), wagers(*), beta(*)").order("id"); // do i rely on RLS to show me what i can access or do i specify here
        if (error) {
            setBets([]);
            return;
        }

        setBets(data);
    };

    useEffect(() => {
        getBets();
    }, [meta]);

    return <BetContext.Provider value={{ bets }}>{children}</BetContext.Provider>;
};

export const useBets = () => useContext(BetContext);
