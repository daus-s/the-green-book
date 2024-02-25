// Bet.js
import "../styles/bets.css";
import OverUnderPlaceBetForm from "./OverUnderPlaceBetForm";

import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

import { useAuth } from "./providers/AuthContext";
import { useModal } from "./providers/ModalContext";
import { supabase } from "../functions/SupabaseClient";


const OverUnderBet = ({ bet }) => {

  const sanitizedMarkdown = DOMPurify.sanitize(bet.description);

  const { user, meta } = useAuth();
  const { failed, succeed } = useModal();

  const result = bet.open?"Open":"Closed";
  const line = bet.line;

  const handlePlaceBet = async (bet_amount, outcome) => {
    //renaming for supabase api
    const _amount = bet_amount;
    const _bet = bet.betID;
    const _user = user.id;
    const _public = meta.publicID
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
      _outcome,
      _public
    });
    if (!error&&data===0) { //previously was data&&data==0 this is strictly never true because its false && true or true && false // both false
      succeed();
    } 
    else if (data) {
      failed({code: 100_000 + data});
    } 
    else if (error) {
      failed(error);
    } else {
      failed({message: 'Something unexpected occurred.'});
    }
  };

  return (
    <div className="over-under bet">
      <h3
        style={{
          maxWidth: "320px",
          position: "relative",
          left: "8%",
          width: "70%",
          textAlign: "left",
        }}
      >
        {bet.title}
      </h3>
      <div className="description" style={{marginTop:"30px"}}>
        <ReactMarkdown>{sanitizedMarkdown}</ReactMarkdown>
      </div>
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
          Over {bet.odds.over} <br />
          Under {bet.odds.under}
        </div>
      </div>

      {result !== "Closed" && (
        <OverUnderPlaceBetForm onSubmit={handlePlaceBet} bet={bet} />
      )}
    </div>
  );
};

export default OverUnderBet;
