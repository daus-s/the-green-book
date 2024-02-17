import { useEffect, useState } from "react"
import { supabase } from "../functions/SupabaseClient";
import RemoveModal from "./modals/RemoveModal";

import "../styles/user.css"
import { useModal } from "./providers/ModalContext";

export default function UserElement({ public_uid, groupID }) {
    const { failed, succeed } = useModal();
    const [removeModalVisible, setRemoveModalVisible] = useState(false);
    const [user, setUser] = useState(null);

    const handleRemove = async () => {
        console.log(public_uid, groupID);
        const { error } = await supabase.from('user_groups').delete().match({userID: public_uid, groupID: groupID});
        if (error) {
            //set error modal true 
            failed(error);
        } else {
            succeed();
            setRemoveModalVisible(false);
        }
    }

    useEffect(()=>{
        const getUser = async () => {
            const { data, error } = await supabase.from('public_users').select().eq("id", public_uid);
            if (data&&data.length==1) {
                setUser(data[0])
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
            <RemoveModal isOpen={removeModalVisible} onCancel={()=>setRemoveModalVisible(false)} onConfirm={handleRemove} username={user?user.username:"-"}/>
        </div>
    );
}