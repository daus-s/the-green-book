// Bet.js
import "../styles/bets.css";

import { useState } from "react";
import OverUnderPlaceBetForm from "./OverUnderPlaceBetForm"; // Assuming you have a component for the Place Bet form

const OverUnderBet = ({ id }) => {
  const getBet = async () => {
    //const data = await supabase(); //do in dev mode
  };
  //get using id
  const result = "Open";
  const line = 7.5;
  const odds = { over: 100, under: -100 };
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
        <div className="line"> OU {line}</div>
        <div className="ou">
          Over {odds.over < 0 ? "-" + -1 * odds.over : "+" + odds.over} <br />
          Under {odds.under < 0 ? "-" + -1 * odds.under : "+" + odds.under}
        </div>
      </div>

      {result !== "Closed" && (
        <OverUnderPlaceBetForm onSubmit={handlePlaceBet} odds={odds} />
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

export default OverUnderBet;
