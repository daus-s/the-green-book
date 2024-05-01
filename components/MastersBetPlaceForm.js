import { figureOutCurrentRound, getTeamProjection, goodness, goodnessStr } from "../functions/GolfFunctions";
import { fontSize, height, margin } from "../functions/VariableLengths";
import { allButThese, allButThis } from "../functions/AllButThisJSON";
import { useEffect, useState } from "react";
import { coerce, partition } from "../functions/RandomBigInt";
import { getGolfers } from "../functions/GetGolfers";
import { useMobile } from "./providers/MobileContext";
import { supabase } from "../functions/SupabaseClient";
import { useModal } from "./providers/ModalContext";
import { useAuth } from "./providers/AuthContext";  
import MastersInfoModal from "./modals/MastersInfoModal";
import UserSearchResult from "./UserSearchResult";
import DataDropDown from "./DataDropDown";
import Opponent from "./Opponent";
import Search from "./Search";
import { parseable } from "../functions/ParseSchema";
import { useRouter } from "next/router";
import Loading from "./Loading";

function Group({data: group , onClick, display, direction, selected}) {
    if (group) {
        return (
            <div className="group league" onClick={onClick} style={selected?{backgroundColor: 'var(--form-input)'}:{}}>
                {group.groupName}
                {display?<img className={"dda "+direction} src="/arrow.png"/>:<></>}
            </div>
        );
    } 
    else {
        return (
            <div className="placeholder-div league" style={{height: '56px'}} onClick={onClick}>
                {display?<img className={"dda "+direction} src="/arrow.png"/>:<></>}
            </div>
        );
    }
}


function PickNo({num}) {
    return (
        <div className="number">
            <span style={{fontSize: '24px'}}>{num>4?'Alt. ':''}</span><span style={{fontSize: '24px'}}>#</span><span style={{fontSize: '42px', color: 'var(--bright-text)'}}>{(num-1)%4+1}</span>
        </div>
    );
}

function StaticGolfer({data}) {
    const roundNo = data?figureOutCurrentRound(data):0;
    const curr = data?.round;
    let bgs = [{}, {}, {}, {}];
    for (let i = 0; i <= roundNo; ++i) {
        if (i == roundNo) {
            bgs[i] = goodness(curr);
        } else {
            bgs[i] = goodness(data[`rd${i+1}`]-72);
        }
    }

    return (
        <div className="golfer display">
           <div className="golfer-name">
                {data?.name}
            </div>
            <div className="strokes">
                <div className="stat" style={bgs[0]}>
                    <div className="box-score">
                        {data?.rd1}
                    </div>
                </div>
                <div className="stat" style={bgs[1]}>
                    <div className="box-score">
                        {data?.rd2}
                    </div>
                </div>
                <div className="stat" style={bgs[2]}>
                    <div className="box-score">
                        {data?.rd3}
                    </div>
                </div>
                <div className="stat" style={bgs[3]}>
                    <div className="box-score">
                        {data?.rd4}
                    </div>
                </div>
                Strokes
                <div className="stat" style={goodness((data?.strokes/4)-72)}>
                    <div className="box-score wide">
                        {data?.strokes}
                    </div>
                </div>
                Score
                <div className="stat" style={goodness(data?.total)}>
                    <div className="box-score">
                        {data?.total}
                    </div>
                </div>
            </div>
        </div>
    );
}

function Golfer({data, onClick, selected, display, direction}) {
    const {width } = useMobile();
    if (!data) {
    return (
        <div className="golfer drop-down-item empty" onClick={onClick} style={display?{position: 'absolute', zIndex: 1, height: `${height(width)}px`}:{ height: `${height(width)}px`}}>
            {display?<img className={"dda "+direction} src="/arrow.png"/>:<></>}
        </div>
        );
    } 
    else if (!data.name || !data.strokes || parseable(data._id) || !(data?.total||data?.total===0)) {
        console.error(data);
        throw Error('the golfer component requires data to be non-nullish and the parameters\n    • name: string\n    • strokes: number <int>\n    • index: number <uint_8>\n\n    • total: number\n{', JSON.stringify(data), '}');
    } 
    else {

        return (
            <div className={"golfer drop-down-item"+((selected)?" selected":"")} onClick={onClick} style={display?{position: 'absolute', height: `${height(width)}px`}:{height: `${height(width)}px`}}>
                <div className="golfer-name" style={{fontSize:`${fontSize(width)}px`}}>
                    {data.name}
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                    <div className="strokes" style={{ marginRight: `${2*margin(width)}px`}}>
                        <span style={{fontSize: `${.75*fontSize(width)}px`, fontWeight: 600, color: 'var(--bet-text-color)'}}>Strokes</span><span style={{fontSize: `${.9375*fontSize(width)}px`, fontWeight: 600, color: 'var(--bright-text)'}}>{data.strokes}</span>
                    </div>
                    <div className="score">
                        <span style={{fontSize: `${.75*fontSize(width)}px`, fontWeight: 600, color: 'var(--bet-text-color)'}}>Score</span><span style={{fontSize: `${.9375*fontSize(width)}px`, fontWeight: 600, color: goodnessStr(data.total)}}>{data.total>0?'+':''}{data.total}</span>
                    </div>
                </div>
                {display?<img className={"dda "+direction} src="/arrow.png"/>:<></>}
            </div>
        );
    }
}

export default function MastersPlaceBetForm({}) {
    const [golfers, setGolfers] = useState(undefined);
    const [p1, setP1] = useState(undefined);
    const [p2, setP2] = useState(undefined);
    const [p3, setP3] = useState(undefined);
    const [p4, setP4] = useState(undefined);
    const [alt1, setAlt1] = useState(undefined);
    const [alt2, setAlt2] = useState(undefined);
    const [alt3, setAlt3] = useState(undefined);
    const [alt4, setAlt4] = useState(undefined);
    
    const [errors, setErrors] = useState([false,false,false,false,false,false,false,false]);
    const [seeInfo, setSeeInfo] = useState(false);
    
    const [league, setLeague] = useState(undefined);
    const [leagueErr, setLeagueErr] = useState(false);
    const [opp, setOpp] = useState(undefined);
    const [oppErr, setOppErr] = useState(false);
    const [groups, setGroups] = useState([]);
    const [tournament, setTournament] = useState();


    const [mode, setMode] = useState('League');
    const [viewing, setViewing] = useState('Starters');

    const { width } = useMobile();
    const { meta } = useAuth();
    const router = useRouter();
    const { succeed, failed } = useModal();


    const getTournament = async () => {
        if (router.query.tournament) {
            const { data: tournament, error: strawberry } = await supabase.from('tournaments').select().eq('extension', router.query?.tournament).single(); //protected by uniqueness condition
            if (!strawberry&&tournament) {
                setTournament(tournament);
            }
        }
    }

    const getPlayers = async () => {
        const {data, error}  = await getGolfers(tournament);
        if (!error) {
            //console.log('setting Golfers literally right now');
            setGolfers(data);
        } else {
            console.log(error);
        }
    }
        
    const getYourGroups = async () => {
        if (meta?.publicID||meta.publicID===0) {
            const {data: groupIDs, error: errorGroupIDs} = await supabase.from('user_groups').select().eq('userID', meta.publicID);
            if (!errorGroupIDs&&groupIDs.length) {
                let stack = [];
                for (const userGroup of groupIDs) {
                    const {data, error} = await supabase.from('groups').select().eq('groupID', userGroup.groupID).single()
                    if (data&&!error) { 
                        stack.push(data); 
                    }
                }
                setGroups(stack);
            } else {
                setGroups([]);
            }
        }
    }
    useEffect(()=>{
        getTournament();
    }, [router])

    useEffect(()=>{
        getPlayers();
    }, [tournament])

    useEffect(()=> {
        getYourGroups();
    }, [meta])

    const handleSubmit = async (e) => {
        e.preventDefault(); //must have this otherwise golfers deload
        if (mode==='Opponent') {
            if (!(p1&&p2&&p3&&p4&&alt1&&alt2&&alt3&&alt4)) {
                setErrors([p1?false:true,p2?false:true,p3?false:true,p4?false:true,alt1?false:true,alt2?false:true,alt3?false:true,alt4?false:true]);
                setOppErr(opp?false:true);
                return; 
            }
        } 
        else if (mode==='League') {
            //then we do DFS mode
            if (!(p1&&p2&&p3&&p4)) {
                setErrors([p1?false:true,p2?false:true,p3?false:true,p4?false:true, false, false, false, false]);
                setLeagueErr(league?false:true);
                return;
            }
        }
        //compression xd
       
        if (mode==='League') {
            if (!league) {
                setLeagueErr(true);
                return;
            }
            const players = coerce(p1.index, p2.index, p3.index, p4.index);

            // console.log('columns');
            // console.log('userID', meta.publicID);
            // console.log('players', players);
            // console.log('leagueID', league.groupID);
            const { error } = await supabase.from('masters_league').insert({public_id: meta.publicID, 
                                                                            players: players,
                                                                            league_id: league.groupID
                                                                            });
            if (error) {
                if (error.code == 23505) {
                    const { error: e } = await supabase.from('masters_league').update({public_id: meta.publicID, 
                                                                                    players: players,
                                                                                    league_id: league.groupID
                                                                                    }
                                                                                    )
                                                                                    .eq('public_id', meta.publicID)
                                                                                    .eq('league_id', league.groupID);
                    if (e) {
                        failed(e.message);
                    }
                    else {
                        succeed();
                        window.location.href = '/pga';
                    }
                }
                else {
                    failed(error.message);
                }
            } 
            else {
                succeed();
                window.location.href = '/pga';
            }
        } 
        else if (mode==='Opponent') {
            if (!opp) {
                setOppErr(true);
                return;
            }
            const players = coerce(p1.index, p2.index, p3.index, p4.index);
            const alternates = coerce(alt1.index, alt2.index, alt3.index, alt4.index);

            // console.log('columns');
            // console.log('userID:', meta.publicID);
            // console.log('players:', players);
            // console.log('alternates:', alternates);
            // console.log('opponentID:', opp.id); 

            const { error } = await supabase.from('masters_opponents').insert({public_id: meta.publicID, 
                                                              players: players, 
                                                              alternates: alternates, 
                                                              oppie: opp.id
                                                            });

            if (error) {
                if (error.code == 23505) {
                    const { error: e } = await supabase.from('masters_opponents').update({public_id: meta.publicID, 
                                                                         players: players, 
                                                                         alternates: alternates, 
                                                                         oppie: opp.id})
                                                                .eq('public_id', meta.publicID)
                                                                .eq('oppie', opp.id);
                    if (!e) {
                        succeed();
                        window.location.href = '/pga';
                    } else {
                        failed(error.message);
                    }
                } 
                else {
                    failed(error.message);
                }

            } 
            else  {
                window.location.href = '/pga';
            }
        }
    }

    const handleSelect = (data) => {
        //now this is what we call a human rights violation
        setOpp(data);
    }

    const errM = 'Please pick a golfer';
    return (
        golfers
        ?
        <div className="masters-place-bet-form">
            <div className="pick-box" style={{height: `${2*height(width)+80+96+55}px`, maxHeight: '373px'}}>
                <div className="picks title">
                    Picks
                </div>
                <div className="first-team">
                        <div style={{margin: `0px ${margin(width)}px`, width: 'calc(25% - 20px)'}}><PickNo num={1}/><div className={"player-selector one "+(errors[1]&&!p1?"error-wrapper":"")}><DataDropDown data={p1} list={allButThese(golfers, [p2, p3, p4, p1, alt2, alt3, alt4])} set={setP1} JSX={Golfer}/></div>{errors[1]&&!p1?<div className="error-message">{errM}</div>:<></>}</div>
                        <div style={{margin: `0px ${margin(width)}px`, width: 'calc(25% - 20px)'}}><PickNo num={2}/><div className={"player-selector two "+(errors[2]&&!p2?"error-wrapper":"")}><DataDropDown data={p2} list={allButThese(golfers, [p1, p3, p4, p1, alt1, alt3, alt4])} set={setP2} JSX={Golfer}/></div>{errors[2]&&!p2?<div className="error-message">{errM}</div>:<></>}</div>
                        <div style={{margin: `0px ${margin(width)}px`, width: 'calc(25% - 20px)'}}><PickNo num={3}/><div className={"player-selector thr "+(errors[3]&&!p3?"error-wrapper":"")}><DataDropDown data={p3} list={allButThese(golfers, [p2, p1, p4, p1, alt2, alt1, alt4])} set={setP3} JSX={Golfer}/></div>{errors[3]&&!p3?<div className="error-message">{errM}</div>:<></>}</div>
                        <div style={{margin: `0px ${margin(width)}px`, width: 'calc(25% - 20px)'}}><PickNo num={4}/><div className={"player-selector for "+(errors[4]&&!p4?"error-wrapper":"")}><DataDropDown data={p4} list={allButThese(golfers, [p2, p3, p1, p1, alt2, alt3, alt1])} set={setP4} JSX={Golfer}/></div>{errors[4]&&!p4?<div className="error-message">{errM}</div>:<></>}</div>
                </div>
                {mode==='Opponent'?
                    <div className="alternates">
                        <div style={{margin: `0px ${margin(width)}px`, width: 'calc(25% - 20px)'}}><PickNo num={5}/><div className={"player-selector alt-one "+(errors[4]&&!alt1?"error-wrapper":"")}><DataDropDown data={alt1} list={allButThese(golfers, [p2, p3, p4, p1, alt2, alt3, alt4])} set={setAlt1} JSX={Golfer}/></div>{errors[4]&&!alt1?<div className="error-message">{errM}</div>:<></>}</div>
                        <div style={{margin: `0px ${margin(width)}px`, width: 'calc(25% - 20px)'}}><PickNo num={6}/><div className={"player-selector alt-two "+(errors[5]&&!alt2?"error-wrapper":"")}><DataDropDown data={alt2} list={allButThese(golfers, [p2, p3, p4, p1, alt1, alt3, alt4])} set={setAlt2} JSX={Golfer}/></div>{errors[5]&&!alt2?<div className="error-message">{errM}</div>:<></>}</div>
                        <div style={{margin: `0px ${margin(width)}px`, width: 'calc(25% - 20px)'}}><PickNo num={7}/><div className={"player-selector alt-thr "+(errors[6]&&!alt3?"error-wrapper":"")}><DataDropDown data={alt3} list={allButThese(golfers, [p2, p3, p4, p1, alt2, alt1, alt4])} set={setAlt3} JSX={Golfer}/></div>{errors[6]&&!alt3?<div className="error-message">{errM}</div>:<></>}</div>
                        <div style={{margin: `0px ${margin(width)}px`, width: 'calc(25% - 20px)'}}><PickNo num={8}/><div className={"player-selector alt-for "+(errors[7]&&!alt4?"error-wrapper":"")}><DataDropDown data={alt4} list={allButThese(golfers, [p2, p3, p4, p1, alt2, alt3, alt1])} set={setAlt4} JSX={Golfer}/></div>{errors[7]&&!alt4?<div className="error-message">{errM}</div>:<></>}</div>
                    </div>
                    :
                    <></>
                }
            </div>
            <form className="form" onSubmit={(e)=>handleSubmit(e)}>
                <div className="tab-radio">
                    <div className="tab" onClick={()=>{setMode('League'); setViewing('Starters');}} style={mode==='League'?{backgroundColor: 'var(--nav-link-hover-color)'}:{}}>League</div>
                    <div className="tab" onClick={()=>setMode('Opponent')} style={mode==='Opponent'?{backgroundColor: 'var(--nav-link-hover-color)'}:{}}>Duo</div>
                </div>
                <div className="form-header">
                    {mode}
                </div>
                <div className="form-body">
                    <div className="team">
                        <div className="team-title-wrapper">
                            <div className="team-title" style={viewing==='Starters'?{backgroundColor: 'var(--soft-highlight)'}:{}} onClick={()=>setViewing('Starters')}>
                                Starters
                            </div>
                            {mode==='Opponent'?
                                <div className="team-title" style={viewing==='Alternates'?{backgroundColor: 'var(--soft-highlight)'}:{}} onClick={()=>setViewing('Alternates')}>
                                    Alternates
                                </div>
                            :
                                <></>
                            }
                        </div>
                        <div className="starters">
                            {viewing==='Starters'?
                            <>
                                <StaticGolfer data={p1} />
                                <StaticGolfer data={p2} />
                                <StaticGolfer data={p3} />
                                <StaticGolfer data={p4} />
                            </>
                            :
                            <>
                                <StaticGolfer data={alt1} />
                                <StaticGolfer data={alt2} />
                                <StaticGolfer data={alt3} />
                                <StaticGolfer data={alt4} />
                            </>
                            }
                        </div>
                    </div>
                    <div className="actions-golf" style={mode==='League'?{marginTop: '40px'}:{}}>
                        {mode=='Opponent'?
                            <>
                                <Opponent user={opp} error={oppErr&&!opp}/>
                                <div className="user-search">
                                    <Search name='users' fields={['username']} table='public_users' JSX={UserSearchResult} onSelect={handleSelect}/>
                                </div>
                            </>
                            : 
                            <></>
                        }
                        {mode==='League'?
                            <div className="your-group-selector">
                                <DataDropDown list={groups} set={setLeague} JSX={Group}/>
                            </div>
                            : 
                            <></>
                        }
                        <div className="projection">
                            Your team is projected to score <span className="number">{isNaN(getTeamProjection(p1, p2, p3, p4))?'-':getTeamProjection(p1, p2, p3, p4)}.</span>
                        </div>

                        <button type="submit" className="cta-button">Submit</button>
                    </div>
                </div>
            </form>
            <MastersInfoModal isOpen={seeInfo} onClose={()=>setSeeInfo(false)}/>
        </div>
        :
        <Loading />
    );
}