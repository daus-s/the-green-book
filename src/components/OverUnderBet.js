// Bet.js
import "../styles/bets.css";

import { useState } from "react";
import OverUnderPlaceBetForm from "./OverUnderPlaceBetForm"; // Assuming you have a component for the Place Bet form

const OverUnderBet = ({ data }) => {
  //get using id
  const result = data.open?"Open":"Closed";
  const line = data.line;
  const odds = data.odds;
  const [userBet, setUserBet] = useState(null);

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
        {data.title}
      </h3>
      <p>{data.description}</p>
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
          Over {odds.over} <br />
          Under {odds.under}
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
