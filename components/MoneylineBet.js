import MoneylinePlaceBetForm from "./MoneylinePlaceBetForm"; 
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

import { supabase } from "../functions/SupabaseClient";
import { useAuth } from "./providers/AuthContext"
import { useModal } from "./providers/ModalContext";
import { useMobile } from "./providers/MobileContext";


const MoneyLineBet = ({ bet }) => {
  
  const title = DOMPurify.sanitize(bet.title);
  const sanitizedMarkdown = DOMPurify.sanitize(bet.description);


  const { user, meta } = useAuth();
  const { failed, succeed } = useModal();
  const { isMobile, height, width } = useMobile();
  const elementWidth = `${Math.min(height, width) - 20}px`;


  const result = bet.open?"Open":"Closed";
  const odds = bet.odds;

  const handlePlaceBet = async (bet_amount, outcome) => {
    //renaming for supabase api
    const _amount = bet_amount;
    const _bet = bet.betID;
    const _user = user.id;
    const _public = meta.publicID
    const _outcome = outcome;

    const { data, error } = await supabase.rpc("place_bet", { // python has the neww featurre like this wwhere is justt 
                                                              // def fun(_amount: int):
                                                              //     ...
                                                              // 
                                                              // usage:
                                                              //   _amount = 10
                                                              //   fun(_amount=)
                                                              // 
                                                              // means _amount is the variable. this is already bad enough
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
    <div className="money-line bet" style={isMobile?{width: elementWidth}:{}}>
      <h3
        style={{
          maxWidth: "320px",
          position: "relative",
          left: "8%",
          width: "70%",
          textAlign: "left",
          ...isMobile?mobileStyle.header:{}
        }}
      >
        {title}
      </h3>
      <div className="description" style={{marginTop:"30px", ...isMobile?mobileStyle.desc:{}}}>
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
        <div className="it-hits">
          Hits{" "}{odds.hits?odds.hits:NaN}
        </div>
        <div className="f-ck">
          Misses{" "}{odds.misses?odds.misses:NaN}
        </div>
      </div>
      {result !== "Closed" && (
        <MoneylinePlaceBetForm onSubmit={handlePlaceBet} bet={bet} />
      )}
    </div>
  );
};

const mobileStyle = {
  bet: {
    width: 'calc(100% - 20px)'
  },
  header: {
    width: '55%',
    paddingLeft: '15px',
    height: 'calc(2em + 7px)',
    overflowY: 'hidden', 
    textOverflow: 'ellipsis'
  },
  desc: {
    width: 'calc(100% - 20px)',
  }
}

export default MoneyLineBet;
