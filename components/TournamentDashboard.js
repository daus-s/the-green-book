import { useAuth } from "./providers/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "../functions/SupabaseClient";
import { encode } from "../functions/Encode";
import { determineOrderAndEvaluate, getPosition, getTeamScore, goodnessStr } from "../functions/GolfFunctions";

import Loading from "./Loading";
import Link from "next/link";
import { getGolfers } from "../functions/GetGolfers";
import { coerce, partition } from "../functions/RandomBigInt";
import { podiumColors } from "../functions/OnTheH8rs";
import { useRouter } from "next/router";
import CreateNewGolfWager from "./CreateNewGolfWager";

export default function TournamentDashboard() {
    const [golfers, setGolfers] = useState(undefined);
    const [leagueBets, setLeagueBets] = useState(undefined);
    const [gentlemanBets, setGentleBets] = useState(undefined);
    const [tournament, setTournament] = useState(undefined);
    
    const { meta } = useAuth();
    const router = useRouter();
    console.log(router.query)

    const getYourLeagueBets = async () => {
        const {data, error} = await supabase.from('masters_league').select().eq('public_id', meta.publicID).eq('tournament_id', tournament.id);
        //console.log('league bets:', data?data:error);
        if (!error&&data) {
            setLeagueBets(data);
        }
    }

    const getYour1v1Bets = async () => {
        const {data, error} = await supabase.from('masters_opponents').select().eq('public_id', meta.publicID).eq('tournament_id', tournament.id);
        //console.log('1v1 bets:', data?data:error);
        if (!error&&data) {
            setGentleBets(data)
        }
    }
    
    const getTournament = async () => {
        if (router.query.tournament) {
            const { data: tournament, error: strawberry } = await supabase.from('tournaments').select().eq('extension', router.query.tournament).single();
            if (!strawberry&&tournament) {
                setTournament(tournament);
            }
        }
    }

    useEffect(()=>{
        if (meta.publicID) {
            if (tournament) {
                getYourLeagueBets();
                getYour1v1Bets();
            }
        }

    }, [meta,tournament])

    useEffect(()=>{
        getTournament();
    }, [router])

    useEffect(()=>{
        const getGs = async () => { 
            if (tournament) {
                const {data, error} = await getGolfers(tournament); 
                if (!error) {
                    //console.log('setting Golfers literally right now');
                    setGolfers(data);
                } else {
                    console.log(error);
                }
            }
        }
        getGs();
    },[tournament]);

    return (
        <div className="masters dashboard">
            <div className="live stats scrollbox">
                <TournamentTable tourney={golfers?golfers:[]}/>
            </div>
            <div className="bar scrollbox">
                <div className="your-league-bets scrollbox-content" >
                    <div className="msb-header">
                        League Bets
                    </div>
                    <div className="league-bets">
                        {
                        golfers&&leagueBets
                        ?
                            <>
                            {
                            leagueBets.length
                            ?
                                leagueBets.map((bet)=>{
                                    const comp = <BetLink key={bet.league_id} bet={bet} tourney={golfers} />;
                                    return comp;
                                })
                            :
                                <div className="no-results">
                                    No bets
                                </div>
                            }
                            <CreateNewGolfWager />
                            </>
                        :
                            <Loading />
                        }
                    </div>
                </div>
                <div className="your-1v1-bets scrollbox-content">
                    <div className="msb-header">
                        Single bets
                    </div>
                    <div className="m-1v1-bets">
                        {
                        golfers&&gentlemanBets
                        ?
                            <>
                            {
                            gentlemanBets.length
                            ?
                                gentlemanBets.map((bet, index)=>{
                                    return <BetLink key={index} bet={bet} tourney={golfers} />;
                                })
                            :
                                <div className="no-results">
                                    No bets
                                </div>
                            }
                            <CreateNewGolfWager />
                            </>
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
    const link = '/pga/masters-2024/bet/%s';  
    const aid = bet.oppie?bet.oppie:bet.league_id;
    const ext = (bet.oppie?'@':'$') + (encode(aid)); //@ is one on one bet, $ is league bet
    const [anti, setAnti] = useState(undefined); // this is either a league object or a public_user object
    const [teams, setTeams] = useState(undefined);
    const {meta} = useAuth();

    // const targetDate = new Date('2024-04-13T04:59:00'); // update this to automatically set the cut line this should be stored in the db in a new relation
    // const now = Date.now();

    // const message = now < targetDate.getTime() && teams?.opp ? <p title="You will be refunded any tokens spent">No submission</p> : <div>idk some hourglass place holder or some ascii art</div>;
    useEffect(()=>{
        const getData = async () => {
            if (bet) {
                if (bet?.oppie) { //these typeofs arent performant find a better solution
                    //we are working with a 1-on-1 bet
                    const {data, error} = await supabase.from('public_users').select().eq('id', bet.oppie).single();
                    if (data) {
                        // imean what am i gonna do throw an error to the user? nah we pretend it cant load 
                        setAnti(data);
                    }
                    const {data: opp, error: e1} = await supabase.from('masters_opponents').select().eq('oppie', bet.public_id).eq('public_id', bet.oppie).single();
                    if (!e1) {
                        const data2 = bet?.oppie?determineOrderAndEvaluate(bet, opp):undefined;
                        // console.log('teams from src = ', data2);
                        if (data2) {
                            setTeams(data2);
                        }
                    } else {
                        setTeams({user: partition(bet.players), opp: null});
                    }
            
                        
                

                }
                if (bet?.league_id) {
                    const {data: league, error: leagueError} = await supabase.from('groups').select().eq('groupID', bet.league_id).single();
                    if (league) {
                        setAnti(league);
                    }
                    const {data: brackets, error: bracketError} = await supabase.from('masters_league').select().eq('league_id', bet.league_id) 
                    // console.log(brackets?brackets:bracketError);
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
                        <div className="score" style={{display: 'flex', justifyContent: 'center'}}>
                            <Loading style={{filter: 'brightness(200%)', margin: '0px 0px 0px 0px', transform: 'scale(75%)', position: 'relative', bottom: '15px'}}/>
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
                    score<span className="score-box" style={{backgroundColor: goodnessStr(getTeamScore(bet.players, tourney)/4), left: '0px', position: 'relative', marginLeft: '2px'}}>{getTeamScore(bet.players, tourney)}</span>
                    </div>
                    <div className="league-place" style={{ gridColumn: '3 / span 2', gridRow: '2', transform: 'translateY(5px)' }}>
                        <span style={{fontSize: '24px', marginBottom: '5px'}}>#</span><span style={{fontSize: '48px', color: podiumColors(position)}}>{position}</span>
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
       throw Error('failed to create a component')
    }
}

function  TournamentTable({tourney}) {
    const [asc, setAsc] = useState(true);
    const [sortOn, setSortOn] = useState('total');
    const [sorted, setSorted] = useState(tourney);

    useEffect(()=>{
        const arr = [...tourney];
        arr.sort((a,b)=>asc?a[sortOn]-b[sortOn]:b[sortOn]-a[sortOn]);
        setSorted(arr);
    }, [sortOn, asc, tourney]);

    const changeCrit = (field) => {
        if (sortOn === field) {
            setAsc(prev=>!prev);
        }
        else {
            setSortOn(field);
            setAsc(true);
        }
    }

    return (
        <table className="scrollbox-content">
            <thead>
                <tr>
                    <th onClick={()=>changeCrit('name')}>Golfer{sortOn==='name'?<img className="sort-arrow" src="/arrow.png" alt={asc?'sort indicator least to greatest':'sort indicator largest to smallest'} style={asc?{}:{transform: 'rotate(180deg)'}}/>:<></>}</th>
                    <th onClick={()=>changeCrit('total')}>Score{sortOn==='total'?<img className="sort-arrow" src="/arrow.png" alt={asc?'sort indicator least to greatest':'sort indicator largest to smallest'} style={asc?{}:{transform: 'rotate(180deg)'}}/>:<></>}</th>
                    <th onClick={()=>changeCrit('strokes')}>Strokes{sortOn==='strokes'?<img className="sort-arrow" src="/arrow.png" alt={asc?'sort indicator least to greatest':'sort indicator largest to smallest'} style={asc?{}:{transform: 'rotate(180deg)'}}/>:<></>}</th>
                    <th onClick={()=>changeCrit('rd1')}>Round 1{sortOn==='rd1'?<img className="sort-arrow" src="/arrow.png" alt={asc?'sort indicator least to greatest':'sort indicator largest to smallest'} style={asc?{}:{transform: 'rotate(180deg)'}}/>:<></>}</th>
                    <th onClick={()=>changeCrit('rd2')}>Round 2{sortOn==='rd2'?<img className="sort-arrow" src="/arrow.png" alt={asc?'sort indicator least to greatest':'sort indicator largest to smallest'} style={asc?{}:{transform: 'rotate(180deg)'}}/>:<></>}</th>
                    <th onClick={()=>changeCrit('rd3')}>Round 3{sortOn==='rd3'?<img className="sort-arrow" src="/arrow.png" alt={asc?'sort indicator least to greatest':'sort indicator largest to smallest'} style={asc?{}:{transform: 'rotate(180deg)'}}/>:<></>}</th>
                    <th onClick={()=>changeCrit('rd4')}>Round 4{sortOn==='rd4'?<img className="sort-arrow" src="/arrow.png" alt={asc?'sort indicator least to greatest':'sort indicator largest to smallest'} style={asc?{}:{transform: 'rotate(180deg)'}}/>:<></>}</th>
                    <th onClick={()=>changeCrit('round')}>Current Round{sortOn==='round'?<img className="sort-arrow" src="/arrow.png" alt={asc?'sort indicator least to greatest':'sort indicator largest to smallest'} style={asc?{}:{transform: 'rotate(180deg)'}}/>:<></>}</th>
                    <th onClick={()=>changeCrit('thru')}>Hole{sortOn==='thru'?<img className="sort-arrow" src="/arrow.png" alt={asc?'sort indicator least to greatest':'sort indicator largest to smallest'} style={asc?{}:{transform: 'rotate(180deg)'}}/>:<></>}</th>
                </tr>
            </thead>
            <tbody>
                {sorted.map((golfer, index)=>{
                    return <GolferRow golfer={golfer} key={index}/>
                })}
            </tbody>
        </table>
    );
}

function GolferRow({golfer}) {
    return (
        <tr>
            <td>{golfer.name}</td>
            <td>{golfer.total}</td>
            <td>{golfer.strokes}</td>
            <td>{golfer.rd1}</td>
            <td>{golfer.rd2}</td>
            <td>{golfer.rd3}</td>
            <td>{golfer.rd4}</td>
            <td>{golfer.round}</td>
            <td>{golfer.thru}</td>
        </tr>
    );
} 