// PlaceBetForm.js

import { useEffect, useState } from "react";
import { american } from "../functions/CalculateWinnings.js";
import "../styles/radio.css";
import { supabase } from "../functions/SupabaseClient.js";
import { useAuth } from "./AuthContext.js";
import { getNumber } from "../functions/ParseOdds.js";

const MoneylinePlaceBetForm = ({ onSubmit, bet }) => {
  const [betAmount, setBetAmount] = useState("");
  const [outcome, setOutcome] = useState(null);
  const [wager, setWager] = useState(0);
  const [choice, setChoice] = useState("");
  const [locked, setLocked] = useState(false);
  const { user } = useAuth();

  console.log(bet);

  useEffect(()=>{
    //get user bet
    const getUserBet = async () => {
      const { data, error } = await supabase.from("user_bets").select("amount, outcome").eq("userID", user.id).eq("betID", bet.betID);
      console.log(data?data:error);
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
          if (['hits', 'misses'].includes(bet.outcome)) {
            setOutcome(bet.outcome);
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
    console.log(betAmount);
    if (!outcome) {
      alert("Please select a valid bet option.");
      return;
    } 
    else
    if (!betAmount  || isNaN(parseInt(betAmount)) || betAmount < 0) {
      alert("Please enter a valid bet amount.");
      return;
    } else {
      onSubmit(Math.max(0, parseInt(betAmount)), outcome);
      setBetAmount(""); // Reset the form after submitting
      setOutcome(outcome);
      setWager(parseInt(betAmount));
    }
  };
  console.log("bet:", bet)
  console.log("odds:", bet.odds)
  console.log("choice:", outcome)
  console.log("selected data", bet.odds[choice])
  return (
    <div
      className="bet-form"
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
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
        {outcome?wager+Math.floor(american(getNumber(bet.odds[outcome]), wager)):"-"}
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
      <form
        onSubmit={handleSubmit}
        style={{
          margin: "10px",
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "row",
        }}
      >
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              className="real-radio"
              name="overUnder"
              value="hits"
              checked={outcome === 'hits'}
              onChange={(e)=>{setOutcome(e.target.value)}}
              disabled={locked}
            />
            <div className="custom-radio">Hits</div>
          </label>

          <label className="radio-label">
            <input
              type="radio"
              className="real-radio"
              name="overUnder"
              value="misses"
              checked={outcome === 'misses'}
              onChange={(e)=>{setOutcome(e.target.value)}}
              disabled={locked}
            />
            <div className="custom-radio">Misses</div>
          </label>
        </div>
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
      </form>
    </div>
  );
};

export default MoneylinePlaceBetForm;
