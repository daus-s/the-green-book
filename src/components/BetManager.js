import Header from "./Header";
import { useState, useEffect } from "react";
import { supabase } from "../functions/SupabaseClient";
import { useAuth } from "./AuthContext";

import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

import "../styles/manage.css";
import "../styles/menu.css";

//placed user bets
function BetRow({userBet}) {    
    return (
        <div className="user-bet-row">
            <div className="user-id">
                <img className="user-picture" src={userBet.pfp_url} />
                <div className="user-name">{userBet.username}</div>
            </div>
            <div className="user-option">{userBet.outcome}</div>
            <div className="user-wager">{userBet.amount}</div>
        </div>
    );
}

function PlacedBets({placedBets}) {
    return (
        <div className="placed-bets">
            <div className="user-bets-header">
                <div>User</div>
                <div>Option</div>
                <div>Wager</div>
            </div>
            {placedBets?placedBets.map(bet=><BetRow userBet={bet}/>):""}
        </div>
    );
}

function BetMenu({bets, bet}) {
    // TODO: highlght green and red when selecting option
    const sanitizedMarkdown = DOMPurify.sanitize(bet?.description);

    // console.log(bets?bets.map(bet => JSON.stringify(bet)):undefined);
    return (
        <div className="bet-menu-div">
            <div className="description">
                <ReactMarkdown>{sanitizedMarkdown}</ReactMarkdown>
            </div>
            <PlacedBets placedBets={bets}/>
            <div className="bet-options">
                <div>what the fuck is a kilometer</div>
            </div>
        </div>
    );
}

function BetHeader({bet, toggle}) {
    return (
        <div className="bet-header" onClick={()=>toggle()}> 
            <div className="bet-title">{bet.title}</div>
            <div className="status-icon"> {bet.open?<img src="mark.png" style={{height: '24px'}}/>:<img src="close.png" style={{height: '24px'}}/>} </div>
        </div>
    );
}

function BetTool ({ bet, id }) {
    const [expanded, setExpanded] = useState(false);
    const [betsData, setBetsData] = useState(null);

    const close = () => {
        setExpanded(false);
    }

    const open = () => {
        setExpanded(true);
    }

    useEffect(()=>{
        const getPlacedBets = async () => {
            let joined = [];
            const { data: userBetsData, error: userBetsError } = await supabase.from("user_bets").select().eq("betID", bet.betID);
            if (userBetsData) {
                for (const userBet of userBetsData) {
                    const { data: userData, error: userError } = await supabase.from("public_users").select('pfp_url, username').eq("id", userBet.public_uid).limit(1).single();
                    if (userData) {
                        let concat = {...userData, ...userBet};
                        joined.push(concat);
                    }
                }
                setBetsData(joined);
            }
            else {
                setBetsData([]); //maybe error row here?
            }
        }

        getPlacedBets();
    },[]);
    /**
     * Structure
     * betheader or bedder
     * options on the bet
     */
    return (
        expanded ? <div className="bet menu"><BetHeader toggle={close} bet={bet}/><BetMenu bets={betsData} bet={bet}/></div> : <div className="bet menu"><BetHeader toggle={open} bet={bet}/></div>
    );
}

export default function BetManager() {
    const [bets, setBets] = useState([]);

    const { meta } = useAuth();
    //get bets that ur the owner (commish of)
    useEffect(()=>{
        const getYourBets = async () => {
            const { data, error } = await supabase.from('bets').select().eq('commissionerID', meta.commish);
            if (data) {
                setBets(data);
            }
        }

        getYourBets();
    },[meta]);

    return (
        <div>
            <Header/>
            {bets.map((bet)=>(<BetTool bet={bet} id={bet.betID}/>))}
        </div>
    )
}