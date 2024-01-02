import App from "./App";
import MoneyLineBet from "./MoneylineBet";
import OptionsBet from "./OptionsBet";
import OverUnderBet from "./OverUnderBet";

function bet(b) {
    if (b.mode == 'ou') return <OverUnderBet id={b.id}/> 
    if (b.mode == 'ml') return <MoneyLineBet id={b.id}/> 
    if (b.mode == 'op') return <OptionsBet id={b.id}/> 

}

export default function Bets() {
    const getBets = () => {/*use authprovider*/ }
    return <><App/></>
    // return 
    //     (<div className="bets">

    //     </div>)
    //     ;
}