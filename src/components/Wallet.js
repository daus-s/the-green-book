import "../styles/wallet.css";

import { supabase } from '../functions/SupabaseClient'; // Import your Supabase client configuration
import { useAuth } from './providers/AuthContext'; // Path to your AuthProvider
import { useEffect, useState } from "react";


export default function Wallet(props) {
  const { user, session } = useAuth();


  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect( () => {
    async function fetchWallet() {
      // console.log("wallet", user);
      // console.log("wallet", session);
      if (user && session) {
        try {
          const {data, error} = await supabase.from("user_balances").select("balance").eq("userID", user.id);
          if (data) {
            setBalance(data[0].balance);
            setLoading(false);
          }
        } catch (error) {
          setLoading(true);
          console.error("Error fetching wallet");
        }
      }
    };
    fetchWallet();
  },[user, session]);

  
  const amount = 100;
  return (
    <div className="wallet">
      <img src="money.png" alt="wallet" />
      <div>
        <div className="amount">${loading?<span className="null">&#8212;</span>:balance}</div>
        {/*add "add money" feature here to monetize*/}
      </div>
    </div>
  );
  //todo allow pppurchasing tokens if mponetizing also before that do full security check.
}
