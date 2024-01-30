import "../styles/bets.css";
import OptionsPlaceBetForm from "./OptionsPlaceBetForm";

import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

import { supabase } from "../functions/SupabaseClient";
import { useAuth } from "./AuthContext";

const OptionsBet = ({ bet }) => {
  //console.log(data);
  const { user } = useAuth();

  const sanitizedMarkdown = DOMPurify.sanitize(bet.description);


  const result = bet.open?"Open":"Closed";

  const handlePlaceBet = async (bet_amount, outcome) => {
    //renaming for supabase api
    const _amount = bet_amount;
    const _bet = bet.betID;
    const _user = user.id;
    const _outcome = outcome;
    // const betData = {
    //                     betID: bet.betID,
    //                     userID: user.id,
    //                     amount: amount,
    //                     outcome: outcome
    // };
    const { data, error } = await supabase.rpc("place_bet", {
      _amount,
      _user,
      _bet,
      _outcome
    });
    console.log(data?data:error);
  };

  return (
    <div className="options bet">
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
      <div className="description">
        <ReactMarkdown>{sanitizedMarkdown}</ReactMarkdown>
      </div>
      {result === "Closed" ? (
        <img id="status" src="close.png" />
      ) : (
        <img id="status" src="mark.png" />
      )}
      <OptionsPlaceBetForm onSubmit={handlePlaceBet} bet={bet} />
    </div>
  );
};

export default OptionsBet;
