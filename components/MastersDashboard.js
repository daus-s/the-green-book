import { useAuth } from "./providers/AuthContext";
import { useModal } from "./providers/ModalContext";
import { useEffect, useState } from "react";
import { supabase } from "../functions/SupabaseClient";
import { encode } from "../functions/Encode";
import { determineOrderAndEvaluate, getTeamScore, goodnessStr } from "../functions/GolfFunctions";

import Loading from "./Loading";
import Link from "next/link";
import { getGolfers } from "../functions/GetGolfers";
import { coerce, partition } from "../functions/RandomBigInt";

export default function MastersDashboard({succFlag}) {
    const [golfers, setGolfers] = useState(undefined);
    const [leagueBets, setLeagueBets] = useState(undefined);
    const [gentlemanBets, setGentleBets] = useState(undefined);
    const [loaded, setLoaded] = useState(false);
    
    const {succeed} = useModal();
    const { meta } = useAuth();


    const getYourLeagueBets = async () => {
        const {data, error} = await supabase.from('masters_league').select().eq('public_id', meta.publicID);
        //console.log('league bets:', data?data:error);
        if (data) {
            setLeagueBets(data)
        }
    }

    const getYour1v1Bets = async () => {
        const {data, error} = await supabase.from('masters_opponents').select().eq('public_id', meta.publicID);
        //console.log('1v1 bets:', data?data:error);
        if (data) {
            setGentleBets(data)
        }
    }

 

    useEffect(()=>{
        if (meta.publicID) {
            getYourLeagueBets();
            getYour1v1Bets();
            setLoaded(true);
        }
    }, [meta])

    useEffect(()=>{
        const gg = async () => { 
            const {data, error} = await getGolfers(); 
            if (!error) {
                //console.log('setting Golfers literally right now');
                setGolfers(data);
            }
        }
        gg();
    },[])

    if (succFlag) { //this is retarded
        succeed();
    }

    //console.log('tournament\n', golfers);
    return (
        <div className="masters dashboard page">
            <div className="live stats">
                Updated every minute
            </div>
            <div className="bar">
                <div className="your-league-bets">
                    <div className="msb-header">
                        League Bets
                    </div>
                    <div className="league-bets">
                        {
                        golfers&&leagueBets&&leagueBets.length
                        ?
                        leagueBets.map((bet)=>{return <BetLink key={bet.league_id} bet={bet} tourney={golfers}/>})
                        :
                        loaded
                        ?
                        <div className="no-results">
                            No bets
                        </div>
                        :
                        <Loading />
                        }
                    </div>
                </div>
                <div className="your-1v1-bets">
                    <div className="msb-header">
                        Gentleman's bets
                    </div>
                    <div className="m-1v1-bets">
                        {
                        gentlemanBets&&golfers?
                            gentlemanBets.map((bet)=>{return <BetLink key={bet.oppie} bet={bet} tourney={golfers} />})
                        :
                            <Loading />
                        }
                    </div>
                </div>
            </div>
        </div>
    );

}

function BetLink({bet, tourney}) {
    if (!tourney) {
        throw Error('how are we gonna represent golf data without data...\nallchat: ?');
    }
    const link = '/pga/bet/%s'; //make this correct 
    const aid = bet.oppie?bet.oppie:bet.league_id;
    const ext = (bet.oppie?'@':'$') + (encode(aid)); //@ is one on one bet, $ is league bet
    const [anti, setAnti] = useState(undefined); // this is either a league object or a public_user object
    const [teams, setTeams] = useState(undefined);


    const targetDate = new Date('2024-04-13T04:59:00'); // update this to automatically set the cut line this should be stored in the db in a new relation
    const now = Date.now();

    const message = now < targetDate.getTime() && teams?.opp ? <p title="You will be refunded any tokens spent">No submission</p> : <div>idk some hourglass place holder or some ascii art</div>;
    useEffect(()=>{
        const getData = async () => {
            if (bet) {
                if (typeof bet.oppie === 'number') { //these typeofs arent performant find a better solution
                    //we are working with a 1-on-1 bet
                    const {data, error} = await supabase.from('public_users').select().eq('id', bet.oppie).single();
                    if (data) {
                        // imean what am i gonna do throw an error to the user? nah we pretend it cant load 
                        setAnti(data);
                    }
                    try {
                        const {data: opp, error: e1} = await supabase.from('masters_opponents').select().eq('oppie', bet.public_id).eq('public_id', bet.oppie).single();
                        if (!e1) {
                            const data2 = bet?.oppie?determineOrderAndEvaluate(bet, opp):undefined;
                            console.log('teams from src = ', data2);
                            if (data2) {
                                setTeams(data2);
                            }
                        } else {
                            throw Error(e1.message);
                        }
                    }
                    catch (error) {
                        console.log('opp bet doesnt exist');
                        setTeams({user: partition(bet.players), opp: null});
                    }
                }
                else if (typeof bet.league_id === 'number') {
                    const {data, error} = await supabase.from('groups').select().eq('groupID', bet.league_id).single();
                    if (data) {
                        setAnti(data);
                    }
                }
            }
        }
        getData();
    },[])
    let comp = undefined;
    console.log('your team:', teams?.user);
    console.log('opponent team:', teams?.opp);

    if (bet.oppie) {
        comp = (
            <Link href={link.replace('%s', ext)}>
                <div className="one-on-one-bet">
                    <div className="score">
                        You: {' '}{teams?.opp===null?<span className="asterisk">*</span>:<></>}<span className="score-box" title={teams.opp===null?'Projected based on your first team selections':''} style={{backgroundColor: goodnessStr(teams?getTeamScore(coerce(...teams.user), tourney)/4:0), marginLeft: teams.opp===null?'0px':'6px'}}>{teams?getTeamScore(coerce(...teams.user), tourney):'-'}</span>
                    </div>
                    {
                    teams&&teams.opp===null ?
                        <div className="score">
                            {message}
                        </div>
                    :
                        <div className="score">
                            Opponent: {' '}<span className="score-box" style={{backgroundColor: goodnessStr(teams?getTeamScore(coerce(...teams.opp), tourney)/4:0)}}>{teams?getTeamScore(coerce(...teams.opp), tourney):'-'}</span>
                        </div>
                    }
                </div>
                <div className="bh">
                    Playing
                    <div className="opponent link">
                        <img src={anti?.pfp_url} style={{borderRadius: '50%', height: '24px'}}/>
                        <div className="text-fields">
                            <div className="username">
                                {anti?.username}
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        );
    }
    else if (bet.league_id) {
        //we return a league bet link
        comp =  (
            <Link href={link.replace('%s', ext)}>
                <div className="league-bet">
                    <div className="league-title">
                        {anti?.groupName}
                    </div>
                </div>
                <div className="league link">
        
                </div>
            </Link>
        );
    }
    if (comp) {
        return (
            <div className="container-for-league-or-oppie">
                {comp}
            </div>
        );
    } else {
       
    }
}