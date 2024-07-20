import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../../functions/SupabaseClient';

const BetContext = createContext();

//ensure that this is nested within auth provider in _providers.js
export const BetProvider = ( {children} ) =>  {
    const [bets, setBets] = useState(null);
    const [options, setOptions] = useState(null);
    const [wagers, setWagers] = useState(null);

    const { meta } = useAuth();
    
    const getBets = async () => {
        if (!meta.id) {
            return;
        }
        const { data, error } = await supabase.from("bets2").select().order('id'); // do i rely on RLS to show me what i can access or do i specify here
        if (error) {
            setBets([]);
            return;
        }
        setBets(data);
    }

    const getOptions = async () => {
        if (!Array.isArray(bets)) {
            return;
        }
        const options = [];
        for (const bet of bets) {
            const c = {};
            const { data, error } = await supabase.from("options").select().eq("bid", bet.id);
            if (!error) {
                c[bet.id] = data;
            }
            options.push(c);
        }
    }

    const getWagers = async () => {
        if (!Array.isArray()) {
            return;
        }
        
        
    }

    useEffect(()=>{
        getBets();
    }, [meta])

    useEffect(()=>{
        getOptions();
    },[bets])

    useEffect(()=>{
        getWagers();
    }, [])

    return (
        <BetContext.Provider value={{bets}}>
            {children}
        </BetContext.Provider>
    );
}

export const useBets = () => useContext(BetContext);