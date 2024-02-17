import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { supabase } from "../functions/SupabaseClient";

import UserElement from "./UserElement";

import "../styles/managegroup.css"
import USIModal from "./modals/USIModal";
import { useModal } from "./providers/ModalContext";

function GroupElement({name, id}) {
    const { failed, succeed } = useModal();

    const [users, setUsers] = useState([]);
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

        getUsers();
    }, [])

    return (
        <div className="group-element" id={`group-${id}`}>
            <div className="group-title">
                {name}
            </div>
            <div className="users-container">
                {users.map((user, index)=><UserElement public_uid={user.userID} groupID={id} key={index}/>)}
                <div className="add-user" onClick={()=>setUSIModalVisible(true)}>
                    <img src="insert.png" style={{width: "32px", height: "32px", margin:"1px"}}/>
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