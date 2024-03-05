'use client'

import { supabase } from '../functions/SupabaseClient'; 
import {  useAuth } from './providers/AuthContext.js';
import { useEffect, useState } from "react";


export default function Wallet() {
  const { user, session } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    async function fetchWallet() {
      if (user && session) {
        try {
          const {data, error} = await supabase.from("user_balances").select("balance").eq("userID", user.id);
          if (data) {
            setBalance(data[0].balance);
            setLoading(false);
          }
        } catch (error) {
          setLoading(true);
        }
      }
    };

    fetchWallet();
  },[user, session]);

    return (
    <div className="wallet page">
      <img src="money.png" alt="wallet" />
      <div>
        <div className="amount">${loading?<span className="null">&#8212;</span>:balance}</div>
      </div>
    </div>
  );
  //todo allow purchasing tokens if monetizing also before that do full security check.
}
