import { useEffect, useState } from "react";

import { useAuth } from "./providers/AuthContext.js";
import { supabase } from "../functions/SupabaseClient";
import { american } from "../functions/CalculateWinnings.js";
import { getNumber } from "../functions/ParseOdds";
import { useMobile } from "./providers/MobileContext.js";

const MobileBetRow = ({bet}) => {
    const isAWinner = bet.bets.winner?bet.bets.winner==bet.outcome:false;

    return (
        <div className={`mobile-placed-bet-row mobile-row ${bet.bets.open ? '' : (isAWinner ? 'winner' : 'loser')}`}>
            <div className="mobile-title bet-name">{bet.bets.title}</div>
            <div className="mobile-outcome">{bet.outcome}</div>
            <div className="mobile-wager">{bet.amount}</div>
            <div className="mobile-to-win">
                {
                    bet.bets.open?         
                    bet && bet.bets && bet.bets.odds && bet.bets.odds[bet.outcome] ?
                        Math.floor(american(getNumber(String(bet.bets.odds[bet.outcome])), bet.amount)) : '-' 
                        :
                        ""
                }
            </div>
            <div className="mobile-profits">{bet.bets.open ? "" : bet.bets.winner===bet.outcome?Math.floor(american(getNumber(String(bet.bets.odds[bet.outcome])), bet.amount)):-1*bet.amount}</div>
        </div>
    );
}

const BetRow = ({bet}) => {
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
    const [rate, setRate] = useState(0);
    

    const {user, meta} = useAuth();
    const { isMobile } = useMobile();



    useEffect(()=>{
        const getUserBets = async () => {
            //user_bets.amount, user_bets.outcome, bets.title, bets.winner, bets.odds, bets.mode -- these are the 
            const { data, error } = await supabase.from('user_bets').select('amount, outcome, bets( title, winner, odds, open)').eq('userID', user&&user.id&&user.id).order('bets(open)', { ascending: false});
            if (data) {
                let c = 0; //correct
                let t = 0; //total count
                let w = 0; //wagers
                let p = 0; //profits
                setPlacedBets(data);
                data.map((bet)=>{ 
                    w+=bet.amount; 
                    p+=(bet.bets.open ? 0 : bet.bets.winner===bet.outcome?Math.floor(american(getNumber(String(bet.bets.odds[bet.outcome])), bet.amount)):-1*bet.amount);
                    t++;
                    c+=(bet.bets.open ? 0 : (bet.bets.winner===bet.outcome)&&1) 
                });
                setWagers(w);
                setWinnings(p);
                setLine(p-w);
                setRate(c/t);
            }
        }
        getUserBets();
    }, [user]);

    if (isMobile) {
        return (
            <div className="mobile-placed-bets-table page ">
                <div className="mobile-table scroll-horizontal">        
                    <div className="mobile-placed-bets-header mobile-row">
                        <div className="mobile-title bet-name">Title</div>
                        <div className="mobile-outcome">Outcome</div>
                        <div className="mobile-wager">Wager</div>
                        <div className="mobile-to-win">To Win</div>
                        <div className="mobile-profits">Profits/Loss</div>
                    </div>
                    {placedBets.map((bet, index) => (
                        <MobileBetRow bet={bet} key={index}/>
                    ))}
                </div>
                <div className="mobile-history">
                    You:
                    <div className="total-wager">
                        <div className="descriptor">wagered
                        <div className="value">{wagers}</div>
                        coins.
                        </div>
                    </div>
                    <div className="winnings">
                        <div className="descriptor">have { winnings<0?'lost':'won'}
                        <div className="value">{winnings}</div>
                        coins.
                        </div>
                    </div>
                    <div className="net-change">
                        <div className="descriptor">are {line<0?'down':'all'}
                        <div className="value">{line<0?-1*line:line}</div>
                        coins all-time.
                        </div>
                    </div>
                    <div className="percentage">
                        <div className="descriptor">are correct
                        <div className="value">{parseFloat((rate * 100).toFixed(2)) + "%"}</div>
                        of the time.
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
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
}