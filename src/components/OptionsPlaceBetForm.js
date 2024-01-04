import { useState, useEffect } from "react";
import "../styles/radio.css";
import "../styles/bets.css";

import { american } from "../functions/CalculateWinnings.js";

export default function OptionsPlaceBetForm(props) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [betAmount, setBetAmount] = useState("");
  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Validate that only numeric values are entered
    if (/^\d*$/.test(inputValue)) {
      setBetAmount(inputValue);
    }
  };
  let options = props.options;
  const wager = 500;
  const odds = NaN;

  return (
    <form>
      <div className="option-list">
        {options.map((option, index) => (
          <label className="radio-label" key={index}>
            <input
              className="real-radio"
              type="radio"
              name="options"
              value={option.name}
              onChange={() => setSelectedOption(option.name)}
            />
            <div className="custom-radio option">
              {`${option.name} (${
                option.value > 0 ? "+" + option.value : option.value
              })`}
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
