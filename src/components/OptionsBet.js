import "../styles/bets.css";
import OptionsPlaceBetForm from "./OptionsPlaceBetForm";

import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

import { supabase } from "../functions/SupabaseClient";
import { useAuth } from "./providers/AuthContext";

const OptionsBet = ({ bet }) => {
  //console.log(data);
  const { user, meta } = useAuth();

  const sanitizedMarkdown = DOMPurify.sanitize(bet.description);


  const result = bet.open?"Open":"Closed";

  const handlePlaceBet = async (bet_amount, outcome) => {
    //renaming for supabase api
    const _amount = bet_amount;
    const _bet = bet.betID;
    const _user = user.id;
    const _public = meta.publicID;
    // console.log(`{public_uid,  ${_public}}`)
    const _outcome = outcome;

    const betData = {
                      _amount,
                      _user,
                      _bet,
                      _outcome,
                      _public
    };
    console.log(betData);
    const { data, error } = await supabase.rpc("place_bet", betData);
    if (data&&data==0) {
      succeed();
    } 
    else if (data) {
      failed({code: 100_000 + data});
    } 
    else if (error) {
      failed(error);
    } else {
      failed({message: 'Something unexpected occurred.'})
    }
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
        <>
          <img id="status" src="mark.png" />
          <OptionsPlaceBetForm onSubmit={handlePlaceBet} bet={bet} />
        </>
      )}
    </div>
  );
};

export default OptionsBet;
