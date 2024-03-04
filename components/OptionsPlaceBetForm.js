import { useState, useEffect } from "react";
import { american } from "../functions/CalculateWinnings.js";
import { supabase } from "../functions/SupabaseClient";
import { useAuth } from "./providers/AuthContext.js";
import { getNumber } from "../functions/ParseOdds.js";


export default function OptionsPlaceBetForm({ onSubmit, bet }) {
  const [betAmount, setBetAmount] = useState("");
  const [wager, setWager] = useState(0);
  const [locked, setLocked] = useState(false);
  const [choice, setChoice] = useState("");

  const { user } = useAuth();

  const options = Object.entries(bet.odds).map(([name, value]) => ({
    name,
    value,
  }));

  useEffect(()=>{
    //get user bet
    const getUserBet = async () => {
      const { data, error } = await supabase.from("user_bets").select("amount, outcome").eq("userID", user.id).eq("betID", bet.betID);
      if (data) {
        if (data.length==0)
        {
          setWager(0);
          setChoice(null);
        }
        else if (data.length==1)
        {
          setLocked(true);
          const bet = data[0]
          setWager(bet.amount);
          setChoice(bet.outcome);
          if (options.includes(bet.outcome)) {
            setChoice(bet.outcome);
          }
        }
        else {
          setWager(0);
          setChoice(null);
        }
      } 
      else {
        setWager(0);
        setChoice(null);
      }
    };

    getUserBet();
  },[wager]);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Validate that only numeric values are entered
    if (/^\d*$/.test(inputValue)) {
      setBetAmount(inputValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!choice) {
      alert("Please select a valid bet option.");
      return;
    } 
    else
    if (!betAmount  || isNaN(parseInt(betAmount)) || betAmount < 0) {
      alert("Please enter a valid bet amount.");
      return;
    } else {
      onSubmit(Math.max(0, parseInt(betAmount)), choice);
      setBetAmount(""); // Reset the form after submitting
      // setLocked(true); //but dont lock the form   <------------------------------------ WALL OF SHAME
      setWager(parseInt(betAmount));
    }
  };

  return (
    <form className="options-place-bet-form" onSubmit={handleSubmit}>
      <div className="option-list">
        {options.map((option, index) => (
          <label className="radio-label" key={index}>
            <input
              className="real-radio"
              type="radio"
              name="options"
              value={option.name}
              onChange={() => setChoice(option.name)}
              disabled={locked}
              checked={choice === option.name}

            />
            <div className="custom-radio option">
              <div className="name">
                {option.name}
              </div>
              <div className="value">
                ({option.value})
              </div>
            </div>
          </label>
        ))}
      </div>
      <div className="options-winnings">
        <div
          className="to-win"
          style={{
            fontWeight: "700",
            color: "var(--bet-text-color)",
            fontSize: "18px",
            alignSelf: "flex-end",
            padding: "10px",
          }}
        >
          {"To win: "}
          {(choice&&bet.odds&&wager&&bet.odds[choice])?Math.floor(american(getNumber(bet.odds[choice].toString()), wager)):'-'
          //{outcome?Math.floor(american(getNumber(bet.odds[outcome].toString()), wager)):"-"}

          } 
        </div>
        <div
          className="your-wager"
          style={{
            fontWeight: "700",
            color: "var(--bet-text-color)",
            fontSize: "18px",
            alignSelf: "flex-end",
            padding: "10px",
          }}
        >
          {"Your wager: "}
          {wager}
        </div>
        <div className="value-form">
          <input
            type="text"
            value={betAmount}
            onChange={handleInputChange}
            style={{
              height: "30px",
              width: "6ch",
              textAlign: "center",
              marginRight: "0px",
              borderTopLeftRadius: "8px",
              borderBottomLeftRadius: "8px",
              paddingLeft: "4px",
              paddingRight: "4px",
              paddingTop: "0px",
              paddingBottom: "0px",
              backgroundColor: "var(--input-background)",
              color: "var(--input-text)",
              borderColor: "var(--input-border)",
              backgroundColor: "var(--form-input)",
            }} // Set the width to 3 characters, center the text, and add right margin
          />
          <button
            style={{
              border: "none",
              padding: "0px",
              height: "30px",
              width: "30px",
              borderTopRightRadius: "15px",
              borderBottomRightRadius: "15px",
              backgroundColor: "var(--button-background)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img
              src="star.png"
              alt="Place bet."
              style={{
                height: "20px",
                width: "20px",
                borderTopRightRadius: "8px",
                borderBottomRightRadius: "8px",
              }}
            />
          </button>
        </div>
      </div>
    </form>
  );
}
