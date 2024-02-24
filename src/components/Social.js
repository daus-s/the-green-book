import { useState, useEffect } from "react";
import { useAuth } from "./providers/AuthContext";
import { useModal } from "./providers/ModalContext";
import { supabase } from "../functions/SupabaseClient";

import RequestModal from "../components/modals/RequestModal";

import "../styles/social.css";

function CommissionerElement({commish /* int */}) {
    const [commishInfo, setCommishInfo] = useState({}); 
    useEffect(()=>{
        const abuseRLSAndGetCommishData = async () => {
            console.log(commish)
            if (commish!==-1){
                const { data, error } = await supabase.rpc('get_commish_data', { u: commish });
                setCommishInfo(data);
            }
        }

        abuseRLSAndGetCommishData();
    }, [commish])

    return (
        <div className="commish" title="Commissioner">
            <div className="pic">
                <img src={commishInfo.pfp_url} style={{height: '50px', borderRadius: '50%', padding: '5px'}}/>
            </div>
            <div className="top-down">
                <div className="commish-name">{commishInfo.username}</div>
                <div className="commish-email">{commishInfo.email}</div>
            </div>
        </div>
    );
}

function GroupElement({group, message}) {
    const [joined, setJoined] = useState("Join Group"); //make this a string variable based on the status so requested already a member
    const [reqVis, setReqVis] = useState(false);

    const { meta } = useAuth();
    const { failed, succeed } = useModal();

    const [commish, setCID] = useState(-1);
    if (!group && !message ) { // !a && !b == !(a||b) -- aside very cool little theorem
        throw new Error(`GroupElement cannot exist without parameters. \ngroup=${group}\nmessage=${message}`)
    }
    if (message)
    { 
        return (<div className="result"><div className="message">{message}</div></div>);
    }

    useEffect(()=>{
        const getCommishData = async () => {
            const { data, error } = await supabase.from('commissioners').select('userID').eq('commissionerID', group.commissionerID).single();
            if (data) {
                setCID(data.userID);
            }
        }

        const getStatus = async () => {
            const { data: member,  error: memError } = await supabase.from('user_groups').select().eq('groupID', group.groupID).eq('userID', meta.publicID);
            const { data: request, error: reqError } = await supabase.from('request').select().eq('groupID', group.groupID).eq('userID', meta.publicID);

            console.log(member?member:memError);
            console.log(request?request:reqError);
            // if (member&&member.length===1) {
            //     setJoined("Already a member");
            // }
            // if (request&&request.length===1) {
            //     setJoined("Requested");
            // }
        }
        

        getCommishData();
        getStatus();
    }, []);

    const makeRequest = async () => {
        const { error } = await supabase.from('requests').insert({public_id:meta.public_uid, group_id: group.groupID})
        if (error) {
            failed(error);
        }
        else {
            succeed();
        }
    }
    return (
        <div className="result">
            <div className='group'>
                <div className="group-name">{group.groupName}</div>
                <div className="comm-container"><CommissionerElement commish={commish} /></div>
                <button className={`insert-button`} disabled={joined!=="Join Group"} style={joined!=="Join Group"?{ backgroundColor: 'var(--form-input)', cursor: 'not-allowed'}:{}} onClick={()=>setReqVis(true)}>{joined}</button>
            </div>
            <RequestModal isOpen={reqVis} onClose={()=>{setReqVis(false)}} group={group.groupName} onConfirm={makeRequest} />
        </div>
    );
}

export default function Social() {
    let cook; //this'll come into play fsfs


    //stateful function...
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    //context providers
    const { meta, user } = useAuth();
    const { succeed, failed } = useModal();

    useEffect(()=>{
        const getGroupsByQuery = async () => {
            const { data } = await supabase.from('groups').select().ilike('groupName', `${query}*`);
            if (data) {
                setResults(data);
            }
        }
        getGroupsByQuery();
    }, [query]);

    //i love functional programming
    
    // xddinside
    return (
        <div className="page social">
                <div className='search-groups search-container'>
                    <input className="search-bar" placeholder="search groups..." value={query} onChange={(e)=>setQuery(e.target.value)}/><img style={{height: '32px'}} src="search.png"/>
            </div>
            <div className="social-results">
                {results&&results.length?results.map((group, index)=>{ return <GroupElement group={group} key={index}/>;}):<GroupElement message='No groups found. :('/>}
            </div>
        </div>
    );
}