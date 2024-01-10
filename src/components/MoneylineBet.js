// Bet.js
import "../styles/bets.css";

import { useState } from "react";
import MoneylinePlaceBetForm from "./MoneylinePlaceBetForm"; // Assuming you have a component for the Place Bet form

const MoneyLineBet = ({ data }) => {

  const result = data?"Open":"Closed";
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
        <div className="it-hits">
          Hits{" "}{odds.hits?odds.hits:NaN}
        </div>
        <div className="f-ck">
          Misses{" "}{odds.misses?odds.misses:NaN}

        </div>
      </div>

      {result !== "Closed" && (
        <MoneylinePlaceBetForm onSubmit={handlePlaceBet} odds={odds} />
      )}

    </div>
  );
};

export default MoneyLineBet;
