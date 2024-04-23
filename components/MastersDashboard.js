import { useAuth } from "./providers/AuthContext";
import { useModal } from "./providers/ModalContext";
import { useEffect, useState } from "react";
import { supabase } from "../functions/SupabaseClient";
import { encode } from "../functions/Encode";
import { determineOrderAndEvaluate, getPosition, getTeamScore, goodnessStr } from "../functions/GolfFunctions";

import Loading from "./Loading";
import Link from "next/link";
import { getGolfers } from "../functions/GetGolfers";
import { coerce, partition } from "../functions/RandomBigInt";
import { podiumColors } from "../functions/OnTheH8rs";

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
                        Gentlemen's bets
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
    console.log('bet:', JSON.stringify(bet));

    if (!tourney) {
        throw Error('how are we gonna represent golf data without data...\nallchat: ?');
    }
    const link = '/pga/bet/%s'; //make this correct 
    const aid = bet.oppie?bet.oppie:bet.league_id;
    const ext = (bet.oppie?'@':'$') + (encode(aid)); //@ is one on one bet, $ is league bet
    const [anti, setAnti] = useState(undefined); // this is either a league object or a public_user object
    const [teams, setTeams] = useState(undefined);
    const {meta} = useAuth();

    const targetDate = new Date('2024-04-13T04:59:00'); // update this to automatically set the cut line this should be stored in the db in a new relation
    const now = Date.now();

    const message = now < targetDate.getTime() && teams?.opp ? <p title="You will be refunded any tokens spent">No submission</p> : <div>idk some hourglass place holder or some ascii art</div>;
    useEffect(()=>{
        const getData = async () => {
            console.log('bet')
            if (bet) {
                console.log('u')
                if (bet?.oppie) { //these typeofs arent performant find a better solution
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
                if (bet?.league_id) {
                    console.log('fuck this')
                    const {data: league, error: leagueError} = await supabase.from('groups').select().eq('groupID', bet.league_id).single();
                    if (league) {
                        setAnti(league);
                    }
                    const {data: brackets, error: bracketError} = await supabase.from('masters_league').select().eq('league_id', bet.league_id) 
                    console.log(brackets?brackets:bracketError);
                    if (brackets) {
                        setTeams(brackets);
                    }
                }
            }
        }
        getData();
    },[])
    let comp = undefined;
    // console.log('your team:', teams?.user);
    // console.log('opponent team:', teams?.opp);

    if (bet.oppie) {
        comp = (
            <Link href={link.replace('%s', ext)}>
                <div className="one-on-one-bet">
                    <div className="score">
                        You: 
                        {' '}
                        {teams?.opp?<></>:<span className="asterisk">*</span>}
                        <span className="score-box" title={teams?.opp?'':'Projected based on your first team selections'} style={{backgroundColor: goodnessStr(teams?getTeamScore(coerce(...teams.user), tourney)/4:0)}}>{teams?getTeamScore(coerce(...teams.user), tourney):'-'}</span>
                    </div>
                    {
                    teams?.opp?
                        <div className="score">
                            Opponent: {' '}<span className="score-box" style={{backgroundColor: goodnessStr(teams?getTeamScore(coerce(...teams.opp), tourney)/4:0)}}>{teams?getTeamScore(coerce(...teams.opp), tourney):'-'}</span>
                        </div>
                    :
                        <div className="score">
                            {message}
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
        const position = getPosition(meta.publicID, teams?teams:[], tourney);
        
        comp =  (
            <Link href={link.replace('%s', ext)}>
                <div className="league-bet">
                    <div className="league-title" style={{ gridColumn: '1 / span 4' }}>
                        {anti?.groupName}
                    </div>
                    <div className="league-score" style={{ gridColumn: '1 / span 2', gridRow: '2'}}>
                    score<span className="score-box" style={{backgroundColor: goodnessStr(getTeamScore(bet.players, tourney)/4), left: '0px', position: 'relative', marginLeft: '1px'}}>{getTeamScore(bet.players, tourney)}</span>
                    </div>
                    <div className="league-place" style={{ gridColumn: '3 / span 2', gridRow: '2', transform: 'translateY(5px)' }}>
                        <span style={{fontSize: '18px', marginBottom: '5px'}}>#</span><span style={{fontSize: '36px', color: podiumColors(position)}}>{position}</span>
                    </div>
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