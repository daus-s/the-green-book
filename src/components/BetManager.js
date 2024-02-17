import Header from "./Header";
import { useState, useEffect } from "react";
import { supabase } from "../functions/SupabaseClient";
import { useAuth } from "./providers/AuthContext.js";

import ReactMarkdown from 'react-markdown';
import DOMPurify from 'dompurify';

import ConfirmModal from "./modals/ConfirmModal.js";
import DeleteModal from "./modals/DeleteModal.js";


import "../styles/manage.css";
import "../styles/menu.css";
import { useModal } from "./providers/ModalContext.js";


function OptionRadio({bet, setParentChoice}) {
    const [choice, setChoice] = useState({name:undefined,value:null});
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    
    const { succeed, failed } = useModal();

    const options = Object.entries(bet.odds).map(([name, value]) => ({
        name,
        value,
    }));

    const handleSubmit = (e) => {
        e.preventDefault();
        if (choice&&choice.name&&choice.value) {
            setConfirmModalVisible(true);
        } else {
            alert("Pick a valid outcome.")
        }
    }

    const cashBet = async () => {
        const _bet = bet.betID;
        if (!choice) {
            alert ("Please select a valid option");
            return;
        }
        const _outcome = choice.name;
        const { data, error } = await supabase.rpc('cash_bet', { _bet, _outcome});

        setDeleteModalVisible(false);

        if (data == 0) {
            //success
            succeed();
            window.location.reload(false);
        } else if (data) {
            //failure in function
            failed({code: 100_000+data}); //100_000 + code is the defined rpc error codes
        }
        else if (error) {
            // set failure modal visible
            failed(error);
        } else {
            failed({message: 'Something unexpected failed'});
        }

    }

    const handleDelete = (e) => {
        e.preventDefault();
        setDeleteModalVisible(true);
    }

    const closeBet = async () => {
        const _bet = bet.betID;
        const { data, error } = await supabase.rpc('cancel_bet', { _bet});

        setDeleteModalVisible(false);

        if (data == 0) {
            //success
            succeed();
            window.location.reload(false);
        } else if (data) {
            //failure in function
            failed({code: 100_000+data});
        }
        else if (error) {
            // set failure modal visible
            failed(error);
        } else {
            failed({message: 'Something unexpected failed'});
        }

    }

    return (
        <div className="bet-options">
            <div className="section-title">Options</div>
            <form className="bet-options-confirm" onSubmit={handleSubmit}>
                {options.map((option, index) => (
                    <label className="radio-label" key={index}>
                        <input
                            className="real-radio"
                            type="radio"
                            name="options"
                            value={option.name}
                            onChange={() => setChoice({name:option.name,value:option.value})}
                            checked={choice.name === option.name}
                        />
                        <div className="custom-radio option">
                            <div className="name">
                            {option.name}
                            </div>
                            <div className="value">
                            ({option.value})
                            </div>
                        </div>
                    </label>
                ))}
                <div className="button-container">
                    <button onClick={handleDelete} className="delete-button"><img src="trash.png" alt="Delete" style={{height: "24px"}}/></button>
                    <button className="cash-out-button" type="submit">Confirm</button>
                </div>
            </form>
            <ConfirmModal isOpen={confirmModalVisible} onCancel={()=>{setConfirmModalVisible(false)}} onConfirm={cashBet} title={bet.title} option={choice}/>
            <DeleteModal isOpen={deleteModalVisible} onCancel={()=>{setDeleteModalVisible(false)}} onDelete={closeBet} betName={bet.title}/>
        </div>
    );
}
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

    return (
        <div className="bet-menu-div">
            <div className="description">
                <ReactMarkdown>{sanitizedMarkdown}</ReactMarkdown>
            </div>
            <PlacedBets placedBets={bets}/>
            <div className="bet-options">
                {bet.open?<OptionRadio bet={bet} />:<></>}
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

    const { user, meta } = useAuth();

    //get bets that ur the owner (commish of)
    useEffect(()=>{
        const getYourBets = async () => {
            const { data, error } = await supabase.from('bets').select().eq('commissionerID', meta.commish).order('open', {ascending: false});
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