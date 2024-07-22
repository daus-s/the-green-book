"use client";

import { supabase } from "../functions/SupabaseClient";
import { useAuth } from "./providers/AuthContext.js";
import { useEffect, useState } from "react";
import { useMobile } from "./providers/MobileContext.js";

export default function Wallet() {
    const { user } = useAuth();
    const { width, height, isMobile } = useMobile();

    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchWallet() {
            if (user) {
                try {
                    const { data, error } = await supabase.from("user_balances").select("balance").eq("userID", user.id).single();
                    if (data) {
                        setBalance(data.balance);
                        setLoading(false);
                    }
                } catch (error) {
                    setLoading(true);
                }
            }
        }

        fetchWallet();
    }, [user]);

    return (
        <div className="wallet page" style={isMobile ? { paddingBottom: 0, overflow: "hidden" } : {}}>
            <img src="/money.png" alt="wallet" style={isMobile ? { height: `${Math.min(height, width) - 181}px`, width: `${Math.min(height, width) - 181}px` } : { height: "256px" }} />
            <div>
                <div className="amount" style={isMobile ? { fontSize: "48px", marginTop: 0 } : {}}>
                    ${loading ? <span className="null">&#8212;</span> : balance}
                </div>
            </div>
        </div>
    );
    //todo allow purchasing tokens if monetizing also before that do full security check.
}
