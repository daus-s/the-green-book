import { useEffect, useState } from "react"
import { supabase } from "../functions/SupabaseClient";
import RemoveModal from "./modals/RemoveModal";

import "../styles/user.css"

export default function UserElement({ public_uid, groupID, remove }) {
    const [removeModalVisible, setRemoveModalVisible] = useState(false);
    const [user, setUser] = useState(null);
    console.log('publicID', public_uid);



    useEffect(()=>{
        const getUser = async () => {
            const { data, error } = await supabase.from('public_users').select().eq("id", public_uid);
            console.log(data?data:error);
            if (data&&data.length==1) {
                setUser(data[0]);
            }
        }
        getUser();
    }, []);

    return (
        <div className="user-element">
            <img src={user?user.pfp_url:"/user.png"}/>
            {user?<span className="username">{user.username}</span>:<span className="grayed-out">User</span>}
            <button onClick={()=>setRemoveModalVisible(true)}>
                <img src="x.png"/>
            </button>
            <RemoveModal isOpen={removeModalVisible} onCancel={()=>setRemoveModalVisible(false)} onConfirm={()=>{remove(user); setRemoveModalVisible(false);}} username={user?user.username:"-"}/>
        </div>
    );
}