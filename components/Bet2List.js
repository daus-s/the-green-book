import Bet from "./Bet2";
import { useBets } from "./providers/BetProvider";

export default function Bets() {
    const { bets } = useBets();

    if (bets) {
        return (
            <div className="bet page">
                {bets.map((bet, index)=> {
                    return <Bet bet={bet} key={index} />
                })}
            </div>
        );
    }
}