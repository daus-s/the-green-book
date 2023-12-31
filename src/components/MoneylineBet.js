// Bet.js
import "../styles/bets.css";

import { useState } from "react";
import MoneylinePlaceBetForm from "./MoneylinePlaceBetForm"; // Assuming you have a component for the Place Bet form

const MoneyLineBet = ({ id }) => {
  const getBet = async () => {
    //const data = await supabase(); //do in dev mode
  };
  //get using id
  const result = "Open";
  const odds = { hits: -100, misses: 100 };
  const currentUser = "User1"; // Replace with actual user data
  const [userBet, setUserBet] = useState(null);
  const placeholder /**sample data */ = {
    title: "Over-Under on the Number of Breakups in 2024",
    description:
      "Predict the future! Will the year 2024 see a surge or decline in romantic relationships? Dive into the unpredictable world of human connections and place your bet on whether there will be more or fewer breakups. The fate of love is in your hands!",
  };
  const handlePlaceBet = (amount) => {
    // Placeholder logic for placing a bet
    console.log(`Placing a bet of ${amount} on the bet.`);
    setUserBet({ amount });
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
        {placeholder.title}
      </h3>
      <p>{placeholder.description}</p>
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
          {odds.hits
            ? odds.hits < 0
              ? "Hits -" + -1 * odds.hits
              : "Hits +" + odds.hits
            : NaN}
        </div>
        <div className="f-ck">
          {odds.misses
            ? odds.misses < 0
              ? "Misses -" + -1 * odds.misses
              : "Misses +" + odds.misses
            : NaN}
        </div>
      </div>

      {result !== "Closed" && (
        <MoneylinePlaceBetForm onSubmit={handlePlaceBet} odds={odds} />
      )}

      {userBet && (
        <div>
          <p>Your Bet: {userBet.amount}</p>
          {/* Additional UI for displaying user bets, commissioner actions, etc. */}
        </div>
      )}
    </div>
  );
};

export default MoneyLineBet;
