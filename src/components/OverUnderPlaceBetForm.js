// PlaceBetForm.js

import { useState } from "react";
import { american } from "../functions/CalculateWinnings.js";
import "../styles/radio.css";

const OverUnderPlaceBetForm = ({ onSubmit, odds }) => {
  const [betAmount, setBetAmount] = useState("");
  odds = 500;
  const wager = 100;
  const toWin = 600;
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Validate that only numeric values are entered
    if (/^\d*$/.test(inputValue)) {
      setBetAmount(inputValue);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!betAmount || isNaN(parseFloat(betAmount)) || betAmount > 0) {
      alert("Please enter a valid bet amount.");
      return;
    }

    onSubmit(Math.max(0, parseFloat(betAmount)));
    setBetAmount(""); // Reset the form after submitting
  };

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
        {american(odds, wager)}
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
              value="over"
            />
            <div className="custom-radio">Over</div>
          </label>

          <label className="radio-label">
            <input
              type="radio"
              className="real-radio"
              name="overUnder"
              value="under"
            />
            <div className="custom-radio">Under</div>
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

export default OverUnderPlaceBetForm;
