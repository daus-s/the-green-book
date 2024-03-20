import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { supabase } from "../functions/SupabaseClient";
import { useModal } from "./providers/ModalContext";
import { trnslt } from "../functions/translateMode";

import ADModal from "./modals/ADModal";
import FindUserList from "./FindUserList";
import Notification from "./Notification";
import USIModal from "./modals/USIModal";
import { useMobile } from "./providers/MobileContext";

function Requests({groupID, groupName, setCount}) {
    // const [found, setFound] = useState({})
    const [rs, setRS] = useState([]);
    const [x, setX] = useState(0);
    const [face, setFace] = useState({})

    const [adVis, setADVis] = useState(false);
    const [approve, setApprove] = useState(undefined);

    const { succeed, failed } = useModal();
    const { isMobile } = useMobile();

    useEffect(()=>{
        const getRequests = async() => {
            const {data, error} = await supabase.from('requests').select('user_id').eq('group_id', groupID);
            if (data&&data.length>0) {
                setRS(data);
                setCount?setCount(data.length):()=>{}; //what the fuck
            }
        }
        getRequests();
    }, []);

    useEffect(()=>{
        const getUserData  =  async () => {
            if (rs.length > x) {
                const { data, error } = await supabase.from('public_users').select().eq('id', rs[x]?.user_id).single()
                    if (data) {
                        setFace(data);
                    } else {
                        
                    }
            }
            /*
            if (found[rs[x]]) {
                setFace(rs[x])
            } else {
                
            }
            */
        }

        getUserData();
    }, [x, rs]);

    const accept = async () => {
        const { data, error } = await supabase.rpc('accept_request', {_user: face.id, _group: groupID});
        if (data==0) {
            succeed();
        }
        else {
            failed(data?data:error?error:null);
        }
        setADVis(false);
        window.location.replace(location.href);
    }

    const reject = async () => {
        const { error } = await supabase.from('requests').delete().eq('user_id', face.id).eq('group_id', groupID);
        if (error) {
            failed(error);
        }
        else {
            succeed();
        }
        setADVis(false);
        window.location.replace(location.href);
    }

    const handleAxion = (type) => {
        if (type==='accept') {
            setApprove(true);
        } 
        else if (type==='reject') {
            setApprove(false);
        }
        setADVis(true)
    }


    return (
        <>
            <div className="req-nav-div" style={isMobile?{width:'100%'}:{}}>
                <div className="left" onClick={()=>setX(prv=>(prv-1)%rs.length)}><img src="left.png" style={isMobile?{width: '20px', height:'20px'}:{}}/></div>
                <div className="request"  style={isMobile?{width:'235px'}:{}}>
                    {rs.length?
                        <div className="user" style={isMobile?{width:'100%'}:{}}>
                            <div className="pfp">
                                {face&&face.pfp_url?<img src={face.pfp_url} />:<></>}
                            </div>
                            <div className="top-down">
                                <div className="username">
                                    {face.username?face.username:"Uh-oh :("}
                                </div>
                                <div className="email">
                                    {face.email?face.email:"Something went wrong..."}
                                </div>
                            </div>
                        </div>
                    :
                    <div className="no-results" style={isMobile?{width:'235px'}:{}}>
                        No Requests
                        {/* in here add the little notification element*/}
                    </div>
                    }
                </div>
                <div className="right" onClick={()=>setX(prv=>(prv+1)%rs.length)}><img src="right.png"/></div>
            </div>
            {
            rs.length
            ?
            <div className="decision-box" style={isMobile?{paddingLeft: '0px', width:'100%', padding: '10px 32.5px 2px 32.5px'}:{}}>
                <div className="accept" onClick={()=>handleAxion('accept')}><img src="accept.png"  title="Accept"/><div className="text">Accept</div></div>
                <div className="reject" onClick={()=>handleAxion('reject')}><img src="remove.png" title="Reject"/><div className="text">Reject</div></div>
            </div>
            :
            <></>
            }
            <ADModal isOpen={adVis} onClose={()=>setADVis(false)} onConfirm={approve?accept:reject} approve={approve?approve:false} guest={face} groupName={groupName}/>
        </>
    )
}

function BetElement({bet, groupSize}) {
    const [count, setCount] = useState(0);
    useEffect(()=>{
        const getPlacedBetCount =  async () => {                          //, { count: 'exact', head: true}
            const {data, error} = await supabase.from('user_bets').select('*').eq('betID', bet.betID); //TODO: fix this this is inefficient and limited to 1000
            setCount(data?.length);
        }

        getPlacedBetCount();
    },[])
    return (
        <div className="bet-element bet-view-row">
            <div className="titles">{bet.title}</div>
            <div className="types">{trnslt(bet.mode)}</div>
            <div className='participations' title={`${count}/${groupSize}`}>{groupSize!==0?Number((count/groupSize)).toLocaleString(undefined,{style: 'percent', maximumFractionDigits:0}) :'--'}</div>
        </div>
    )
}

function GroupElement({name, id}) {
    const { meta } = useAuth();
    const { failed, succeed } = useModal();
    const { isMobile, height, width } = useMobile();
    const elementWidth = `${Math.min(height, width) - 20}px`;

    const [USIModalVisible, setUSIModalVisible] = useState(false);

    //GROUP DATA
    const [users, setUsers] = useState([]);
    const [bets, setBets] = useState([]);
    const [commissioner, setCommissioner] = useState({});

    //USE TO PASS TO CHILD
    const [count, setCount] = useState(0);

    const addUser = async (userID) => {
        const { error } = await supabase.from('user_groups').insert({userID: userID, groupID: id})
        if (error) {
            //set failure modal true with message
            failed(error);
        } else {
            succeed();
            setUSIModalVisible(false);
            window.location.replace(location.href);
        }
    }

    const removeUser = async (user) => {
        const { error } = await supabase.from('user_groups').delete().match({userID: user.id, groupID: id});
        if (error) {
            //set error modal true 
            failed(error);
        } else {
            succeed();
            window.location.replace(location.href);
        }
    }
    
    const getUsers = async () => {
        if (id) {
            const {data, error} = await supabase.from('user_groups').select('userID').eq("groupID", id);
            if (data) {
                setUsers(data);
            } else if (error) {

            } else {
            }
        }
    }

    const getBets = async () => {
        if (id) {
            const {data, error} = await supabase.from('bets').select().eq("groupID", id).eq('open', true);
            if (data) {
                setBets(data);
            } else if (error) {

            } else {
            }
        }
    }

    useEffect(()=>{
        getUsers();
        getBets();
    }, [])

    return (
        <div className="group-element" id={`group-${id}`} style={isMobile?{width: elementWidth}:{}} >
            <div className="group-title" style={isMobile?mobileStyle.header:{}}>
                {name}
            </div>
            <div className="group-info" style={isMobile?{flexDirection: 'column'}:{}}>
                <div className="user-group-view">
                    <FindUserList name={name} id={id} addUser={addUser} users={users} setUsers={setUsers} remove={removeUser} commish={meta.publicID}/>
                </div>
                <div className="bets-group-view" >
                    <div className="bets-container-title">
                        Open Bets
                    </div>
                    <div className="bet-container">
                        <div className="bet-view-row"  style={{backgroundColor: 'var(--table-header-background)', padding: '5px', borderBottom: 'solid 1px var(--table-border)', color: 'var(--bright-text)'}}>
                            <div className="titles" title="Bet name">Title</div>
                            <div className="types" title="Bet type">Mode</div>
                            <div className='participations' title="Bet participation">%</div>
                        </div>
                        <div className="scroll">
                            {bets.length?bets.map((bet, index)=><BetElement bet={bet} key={index} groupSize={users.length}/>):<div className="bet-view-row" style={{textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'flex-start', backgroundColor: 'var(--table-header-background)', color: 'var(--big-O-color)', fontWeight: '200', fontStyle: 'italic', padding: '2px 0px 2px 5px'}}>No active bets</div>}
                        </div>
                    </div>
                </div>

            </div>
            <div className="requests">
                    <div className="requests-container-title notification-box">
                        Join Requests
                        <Notification count={count}/>
                    </div>
                    <Requests groupID={id} groupName={name} setCount={setCount}/>
                </div>
            <USIModal isOpen={USIModalVisible}  onCancel={()=>setUSIModalVisible(false)} onConfirm={addUser}/>
        </div>
    );
}

export default function GroupManager() {
    const [groupList, setGroupList] = useState([]);
    const { user, meta } = useAuth();
    const { isMobile } = useMobile();

    useEffect(()=>{
        const getGroups = async () => {
            if (meta.commish) {
                const {data, error} = await supabase.from('groups').select().eq('commissionerID', meta.commish);
                if (data) {
                    setGroupList(data);
                }
            }
        }

        getGroups();
    }, [meta])

    return (
        <div className="group-manager page">
            {groupList.map((group, index)=>
                <div key={index} style={{...isMobile&&mobileStyle.mt}}>
                    {<GroupElement id={group.groupID} name={group.groupName} />}
                </div>) 
            }
        </div>
    );
}

const mobileStyle = {
    groupElement: {
        width: 'calc(100% - 20px)'
    },
    header: {
        width: '100%'
    },
    mt: {
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
        width: '100%',
    }

}