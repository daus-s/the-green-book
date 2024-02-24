import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { supabase } from "../functions/SupabaseClient";

import UserElement from "./UserElement";

import "../styles/managegroup.css"
import USIModal from "./modals/USIModal";
import { useModal } from "./providers/ModalContext";
import { trnslt } from "../functions/translateMode";

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
    const { failed, succeed } = useModal();

    const [users, setUsers] = useState([]);
    const [bets, setBets] = useState([]);
    const [USIModalVisible, setUSIModalVisible] = useState(false);

    const addUser = async (userID) => {
        const { error } = await supabase.from('user_groups').insert({userID: userID, groupID: id})
        if (error) {
            //set failure modal true with message check?
            failed(error);
        } else {
            succeed();
            setUSIModalVisible(false);
            window.location.reload(false);
        }
    }

    useEffect(()=>{
        const getUsers = async () => {
            if (id) {
                const {data, error} = await supabase.from('user_groups').select('userID').eq("groupID", id)
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
                console.log(data?data:error);
            }
        }

        getUsers();
        getBets();
    }, [])

    return (
        <div className="group-element" id={`group-${id}`}>
            <div className="group-title">
                {name}
            </div>
            <div className="group-info">
                <div className="user-group-view">
                    <div className="user-container-title">
                        Users
                    </div>
                    <div className="users-container">
                        {users.map((user, index)=><UserElement public_uid={user.userID} groupID={id} key={index}/>)}
                        <div className="add-user" onClick={()=>setUSIModalVisible(true)}>
                            <img src="insert.png" style={{width: "32px", height: "32px", margin:"1px"}}/>
                        </div>
                    </div>
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
                        {bets.length?bets.map((bet, index)=><BetElement bet={bet} key={index} groupSize={users.length}/>):<div className="bet-view-row" style={{textAlign: 'center', width: '100%', display: 'flex', justifyContent: 'flex-start', backgroundColor: 'var(--table-header-background)', color: 'var(--big-O-color)', fontWeight: '200', fontStyle: 'italic', padding: '2px 0px 2px 5px'}}>No active bets</div>}
                    </div>
                </div>
            </div>
            <USIModal isOpen={USIModalVisible}  onCancel={()=>setUSIModalVisible(false)} onConfirm={addUser}/>
        </div>
    );
}

export default function GroupManager() {
    const [groupList, setGroupList] = useState([]);
    const { user, meta } = useAuth();

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
        <div className="group-manager">
            {groupList.map((group, index)=>
                <div key={index}>
                    {<GroupElement id={group.groupID} name={group.groupName} />}
                </div>) 
            }
        </div>
    );
}