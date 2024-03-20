import UserElement from "./UserElement";
import USIModal from "./modals/USIModal";

import { useState } from "react"; 
import { useMobile } from "./providers/MobileContext";

                                // this comment should stay//the point is that the users are passed in 
                                // theyre not returned i had my ownership on OOP mode
                                // so its like i ask the question...

export default function FindUserList({ id: groupId, addUser, /*how do i make this return the  */users, setUsers, remove, create, commish}) { 
    const [USIModalVisible, setUSIModalVisible] = useState(false);
    const { isMobile } = useMobile();


    const onConfirm = async (arg) => {
        await addUser(arg);
        setUSIModalVisible(false);
    }
    
    return (
        <div className="find-user-list" style={isMobile?{width: '100%'}:{}}>
            <div className="user-group-view">
                <div className="user-container-title">
                    Users
                </div>
                <div className="users-container" style={isMobile?{width: '100%'}:{}}>
                    {users.map((user, index)=><UserElement public_uid={user.userID?user.userID:user.id} groupID={groupId} key={index} remove={(user.userID?user.userID:user.id)===commish?undefined:remove} commish={(user.userID?user.userID:user.id)===commish}/>)}
                    <div className="add-user" onClick={()=>setUSIModalVisible(true)}>
                        <img src="insert.png" style={{width: "32px", height: "32px", margin:"1px", marginLeft: users&&users.length?"1px":"10px"}}/>
                    </div>
                </div>
            </div>
            <USIModal isOpen={USIModalVisible}  onCancel={()=>setUSIModalVisible(false)} onConfirm={onConfirm} />
        </div>
    );
}