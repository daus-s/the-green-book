import { supabase } from "../functions/SupabaseClient";
import { useAuth } from "./providers/AuthContext";
import { useModal } from "./providers/ModalContext";
import OptionsPlaceBetForm from "./OptionsPlaceBetForm";
import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';
import { useMobile } from "./providers/MobileContext";

const OptionsBet = ({ bet }) => {
  const { user, meta } = useAuth();
  const { failed, succeed } = useModal();
  const { isMobile, height, width } = useMobile();
  const elementWidth = `${Math.min(height, width) - 20}px`;


  const title = DOMPurify.sanitize(bet.title);
  const sanitizedMarkdown = DOMPurify.sanitize(bet.description);


  const result = bet.open?"Open":"Closed";

  const handlePlaceBet = async (bet_amount, outcome) => {
    //renaming for supabase api
    const _amount = bet_amount;
    const _bet = bet.betID;
    const _user = user.id;
    const _public = meta.publicID;
    const _outcome = outcome;

    const betData = {
                      _amount,
                      _user,
                      _bet,
                      _outcome,
                      _public
    };
    const { data, error } = await supabase.rpc("place_bet", betData);
 
    // idk what blame is but im blaming this
    if (!error&&data===0) { //previously was data&&data==0 this is strictly never true because its false && true or true && false // both false
      // https://open.spotify.com/track/0V3wPSX9ygBnCm8psDIegu?si=2647a06ca663449a
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
    <div className="options bet" style={isMobile?{width: elementWidth}:{}}>
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
      <div className="description" style={isMobile?mobileStyle.desc:{}}>
        <ReactMarkdown>{sanitizedMarkdown}</ReactMarkdown>
      </div>
      {result === "Closed" ? (
        <img id="status" src="/close.png" />
      ) : (
        <>
          <img id="status" src="/mark.png" />
          <OptionsPlaceBetForm onSubmit={handlePlaceBet} bet={bet} />
        </>
      )}
    </div>
  );
};

const mobileStyle = {
  bet: {
    width: 'calc(100% - 20px)'
  },
  header: {
    width: '65%',
    paddingLeft: '15px',
    height: 'calc(2em + 7px)',
    overflowY: 'hidden', 
    textOverflow: 'ellipsis'
  },
  desc: {
    width: 'calc(100% - 20px)',
  }
}

export default OptionsBet;

