import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import MoneyLineBet from "./MoneylineBet";
import OptionsBet from "./OptionsBet";
import OverUnderBet from "./OverUnderBet";
import { supabase } from "../functions/SupabaseClient";

function bet(b) {
    if (b.mode == 'ou') return <OverUnderBet data={b}/> 
    if (b.mode == 'ml') return <MoneyLineBet data={b}/> 
    if (b.mode == 'op') return <OptionsBet data={b}/> 
}

export default function Bets() {

    const { user, session } = useAuth();

    const [bets, setBets] = useState([]);

    useEffect(()=>{
        const getBets = async () => {
            //get user groups
            const groups = await supabase.from("user_groups").select("groupID").eq("userID", user.id);
            let groupIDs = [];
            groups.data.forEach((group)=>{groupIDs.push(group.groupID)})
            const betList = [];
            for (const id of groupIDs) {
                const { data, error } = await supabase.from('bets').select().eq("groupID", id);
                if (data) {
                    data.forEach((bet) => {
                        betList.push(bet);
                    });
                }
            }
            console.log(betList);
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