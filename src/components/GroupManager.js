import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "../functions/SupabaseClient";

import UserElement from "./UserElement";

function GroupElement({name, id}) {
    const [users, setUsers] = useState([]);
    useEffect(()=>{
        const getUsers = async () => {
            if (id) {
                const {data, error} = await supabase.from('user_groups').select('userID').eq("groupID", id)
                //console.log(id, data?data:error);
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
                {users.map((user, index)=><UserElement public_uid={user.userID} key={index}/>)}
            </div>
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
                    console.log(data);
                    setGroupList(data);
                } else if (error) {
                    //set error modal true
                } else {

                }
            }
        }

        getGroups();
    }, [meta])

    return (
        <div className="group-manager">
            {groupList.map((group, index)=><div key={index}>{<GroupElement id={BigInt(group.groupID)} name={group.groupName} />}</div>) }
        </div>
    );
}