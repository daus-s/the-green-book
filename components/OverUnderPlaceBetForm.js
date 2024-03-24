import { useEffect, useState } from "react";
import { american } from "../functions/CalculateWinnings.js";
import { supabase } from "../functions/SupabaseClient.js";
import { useAuth } from "./providers/AuthContext.js";
import { getNumber } from "../functions/ParseOdds.js";
import { useMobile } from "./providers/MobileContext.js";

const OverUnderPlaceBetForm = ({ onSubmit, bet }) => {
  const [betAmount, setBetAmount] = useState("");
  const [wager, setWager] = useState(0);
  const [locked, setLocked] = useState(false);
  const [choice, setChoice] = useState("");


  const { user } = useAuth();
  const { isMobile } = useMobile();

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    // Validate that only numeric values are entered
    if (/^\d*$/.test(inputValue)) {
      setBetAmount(inputValue);
    }
  };

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
          const bet = data[0];
          setWager(bet.amount);
          if (['over', 'under'].includes(bet.outcome)) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!choice) {
      alert("Please select a valid bet option.");
      return;
    } else
    if (!betAmount || isNaN(parseInt(betAmount)) || parseInt(betAmount) < 0) {
      alert("Please enter a valid bet amount.");
      return;
    }
    else {
      onSubmit(Math.max(0, parseInt(betAmount)), choice);
      setBetAmount(""); // Reset the form after submitting
      setChoice(choice);
      setWager(parseInt(betAmount));
    }
  };

  let odds = bet.odds;

  return (
    <div
      className="over-under-place-bet-form"
      style={{
        display: "flex",
        flexDirection: isMobile?"column":"row",
        justifyContent: "space-between",
      }}
    >
      <div className="winnings-cash" style={{justifyContent: 'space-between'}}>
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
          {(choice&&bet.odds&&wager&&odds[choice])?american(getNumber(odds[choice].toString()), wager):'-'}
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
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          margin: "10px",
          alignItems: "flex-start",
          display: "flex",
          flexDirection: "row",
          justifyContent: 'space-between'        
        }}
      >
        <div className="radio-group">
          <label className="radio-label">
            <input
              type="radio"
              className="real-radio"
              name="overUnder"
              value="over"
              checked={choice==="over"}
              disabled={locked}
              onChange={(e)=>setChoice(e.target.value)}
              onBlur={(e) => e.preventDefault()}
            />
            <div className="custom-radio">Over</div>
          </label>

          <label className="radio-label">
            <input
              type="radio"
              className="real-radio"
              name="overUnder"
              value="under"
              checked={choice==="under"}
              disabled={locked}
              onChange={(e)=>setChoice(e.target.value)}
              onBlur={(e) => e.preventDefault()} //this is to suppress some warning
            />
            <div className="custom-radio">Under</div>
          </label>
        </div>
        <div className="input-buttons">
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
      </form>
    </div>
  );
};

export default OverUnderPlaceBetForm;
