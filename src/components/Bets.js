import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import MoneyLineBet from "./MoneylineBet";
import OptionsBet from "./OptionsBet";
import OverUnderBet from "./OverUnderBet";
import { supabase } from "../functions/SupabaseClient";

function bet(b) {
    if (b.mode == 'ou') return <OverUnderBet bet={b} key={b.betID}/> 
    if (b.mode == 'ml') return <MoneyLineBet bet={b} key={b.betID}/> 
    if (b.mode == 'op') return <OptionsBet bet={b}   key={b.betID}/> 
}

export default function Bets() {

    const { user, session } = useAuth();

    const [bets, setBets] = useState([]);

    useEffect(()=>{
        const getBets = async () => {
            //public id
            const pid = await supabase.from("users").select("publicID").eq("userID", user.id); 
            //get user groups
            const groups = await supabase.from("user_groups").select("groupID").eq("userID", pid.data[0].publicID);
            let groupIDs = [];
            groups.data.forEach((group)=>{groupIDs.push(group.groupID)});
            const betList = [];
            for (const id of groupIDs) {
                const { data, error } = await supabase.from('bets').select().eq("groupID", id);
                if (data) {
                    data.forEach((bet) => {
                        betList.push(bet);
                    });
                }
            }
            //console.log(betList);
            setBets(betList);
            
        }

        getBets();
    },[user, session])
    return (
        <div className="bets">
            {bets.map((b)=>{return bet(b)})
            }
        </div>)
    // return 
    //     (<div className="bets">

    //     </div>)
    //     ;
}