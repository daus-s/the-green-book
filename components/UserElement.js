import { useEffect, useState } from "react"
import { supabase } from "../functions/SupabaseClient";
import RemoveModal from "./modals/RemoveModal";

import "../styles/user.css"
import CommissionerShield from "./CommissionerShield";

export default function UserElement({ public_uid, groupID, remove, commish }) {
    const [removeModalVisible, setRemoveModalVisible] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(()=>{
        const getUser = async () => {
            const { data, error } = await supabase.from('public_users').select().eq("id", public_uid);
            if (data&&data.length==1) {
                setUser(data[0]);
            }
        }
        getUser();
    }, []);

    const rf = (user) => {
        if (remove) {
            remove(user); 
            setRemoveModalVisible(false);
        }   
    }

    return (
        <div className="user-element">
            <div className="icon-parent" style={{display:'flex', alignItems: 'center'}}>
                <img src={user?user.pfp_url:"/user.png"}/>
                {commish?<CommissionerShield style={{width: '16px', height: '16px', transform: 'translateY(0px) translateX(4px)'}}/>: <></>}
            </div>
            {user?<span className="username">{user.username}</span>:<span className="grayed-out">User</span>}
            <button onClick={()=>setRemoveModalVisible(true)} disabled={commish}>
                <img src="x.png"/>
            </button>
            <RemoveModal isOpen={removeModalVisible} onCancel={()=>setRemoveModalVisible(false)} onConfirm={()=>{rf(user)}} username={user?user.username:"-"}/>
        </div>
    );
}