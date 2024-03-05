import { useEffect, useState } from "react";

import { useAuth } from "./providers/AuthContext.js";
import { supabase } from "../functions/SupabaseClient";
import { american } from "../functions/CalculateWinnings.js";
import { getNumber } from "../functions/ParseOdds";

const  BetRow = ({bet}) => {

    const isAWinner = bet.bets.winner?bet.bets.winner==bet.outcome:false;
    return (
        <tr className={`placed-bet-row ${bet.bets.open ? '' : (isAWinner ? 'winner' : 'loser')}`}>
            <td className="status">
                <img src={bet.bets.open ? 'mark.png' : 'close.png'} title={bet.bets.open? 'Open' : 'Closed'} style={{ height: "20px" }} alt={bet.bets.open ? 'Open' : 'Closed'} />
            </td>
            <td className="title">{bet.bets.title}</td>
            <td className="outcome">{bet.outcome}</td>
            <td className="wager">{bet.amount}</td>
            <td className="to-win">
                {
                    bet.bets.open?         
                    bet && bet.bets && bet.bets.odds && bet.bets.odds[bet.outcome] ?
                        Math.floor(american(getNumber(String(bet.bets.odds[bet.outcome])), bet.amount)) : '-' 
                        :
                        ""
                }
            </td>
            <td className="profits">{bet.bets.open ? "" : bet.bets.winner===bet.outcome?Math.floor(american(getNumber(String(bet.bets.odds[bet.outcome])), bet.amount)):-1*bet.amount}</td>
            {/* {JSON.stringify(bet)} */}
        </tr>

      
    );
}

export default function UserBets() {
    const [placedBets, setPlacedBets] = useState([]);
    const [winnings, setWinnings] = useState(0);
    const [wagers, setWagers] = useState(0);
    const [line, setLine] = useState(0);
    

    const {user, meta} = useAuth();


    useEffect(()=>{
        const getUserBets = async () => {
            //user_bets.amount, user_bets.outcome, bets.title, bets.winner, bets.odds, bets.mode -- these are the 
            const { data, error } = await supabase.from('user_bets').select('amount, outcome, bets( title, winner, odds, open)').eq('userID', user&&user.id&&user.id).order('bets(open)', { ascending: false});
            if (data) {
                let w = 0;
                let p = 0;
                setPlacedBets(data);
                data.map((bet)=>{ 
                    w+=bet.amount; 
                    p+=(bet.bets.open ? 0 : bet.bets.winner===bet.outcome?Math.floor(american(getNumber(String(bet.bets.odds[bet.outcome])), bet.amount)):-1*bet.amount)
                });
                setWagers(w);
                setWinnings(p);
                setLine(p-w);
            }
        }
        getUserBets();
    }, [user]);

    return (
<div className="placed-bets-table page">
    <table>
        <thead>
            <tr className="placed-bets-header">
                <th className="status">Status</th>
                <th className="bet-name">Title</th>
                <th className="outcome">Outcome</th>
                <th className="wager">Wager</th>
                <th className="to-win">To Win</th>
                <th className="profits">Profits/Loss</th>
            </tr>
        </thead>
        <tbody>
            {placedBets.map((bet, index) => (
                <BetRow bet={bet} key={index} />  
            ))}
        </tbody>
        <tfoot>
            <tr style={{backgroundColor: 'var(--alt2-table-rows-bg)'}}>
                <th className="status">Totals</th>
                <th className="bet-name"></th>
                <th className="outcome"></th>
                <th className="wager">${wagers}</th>
                <th className="to-win"></th>
                <th className="profits">${winnings}</th>
            </tr>
            <tr>
                <th className="status"></th>
                <th className="bet-name"></th>
                <th className="outcome"></th>
                <th className="wager"></th>
                <th className="to-win totals">Total</th>
                <th className="profits totals" style={{backgroundColor: (line<0?'var(--table-bg-red)':'var(--table-bg-green)')}}>{line<0?`-$${-1*line}`:`$${line}`}</th>
            </tr>
        </tfoot>
    </table>
</div>

    );
}