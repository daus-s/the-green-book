import "../styles/bets.css";

import { useState } from "react";
import MoneylinePlaceBetForm from "./MoneylinePlaceBetForm"; 

import { supabase } from "../functions/SupabaseClient";
import { useAuth } from "./AuthContext";


const MoneyLineBet = ({ data : bet }) => {

  const { user } = useAuth();

  const result = bet.open?"Open":"Closed";
  const odds = bet.odds;

  const [userBet, setUserBet] = useState(null);

  const handlePlaceBet = async (bet_amount, outcome) => {
    // Placeholder logic for placing a bet
    //console.log(`Placing a bet of ${bet_amount} on the bet to ${outcome}.\nuserID: ${user.id}\nbetID: ${bet.betID}`);

    //renaming for supabase api
    const bet_id = bet.betID;
    const user_id = user.id;
    // const betData = {
    //                     betID: bet.betID,
    //                     userID: user.id,
    //                     amount: amount,
    //                     outcome: outcome
    // };
    const { data, error } = await supabase.rpc("increase_bet", {
      bet_amount,
      user_id,
      bet_id,
      outcome
    });
    //console.log(data?data:error);
    //setUserBet({ amount });


  };

  return (
    <div className="over-under bet">
      <h3
        style={{
          maxWidth: "320px",
          position: "relative",
          left: "15%",
          width: "70%",
          textAlign: "left",
        }}
      >
        {bet.title}
      </h3>
      <p>{bet.description}</p>
      {result === "Closed" ? (
        <img id="status" src="close.png" />
      ) : (
        <img id="status" src="mark.png" />
      )}
      <div
        className="odds"
        style={{
          position: "absolute",
          top: "0px",
          right: "0px",
          paddingRight: "10px",
        }}
      >
        <div className="it-hits">
          Hits{" "}{odds.hits?odds.hits:NaN}
        </div>
        <div className="f-ck">
          Misses{" "}{odds.misses?odds.misses:NaN}

        </div>
      </div>

      {result !== "Closed" && (
        <MoneylinePlaceBetForm onSubmit={handlePlaceBet} bet={bet} />
      )}

    </div>
  );
};

export default MoneyLineBet;
