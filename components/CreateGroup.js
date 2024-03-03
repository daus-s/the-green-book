import { supabase } from "../functions/SupabaseClient";
import { useEffect, useState } from "react";
import { useAuth } from "./providers/AuthContext";
import { useModal } from "./providers/ModalContext";
import FindUserList from "./FindUserList";
// import { random } from "../functions/RandomBigInt"; # bigint deprecated pre-release


export default function CreateGroup() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");

  const { user, meta } = useAuth();
  const { failed, succeed } = useModal();



  const getCommissioner = async () => {
    const pid = meta.publicID;
    if (pid) {
      const {data, error} = await supabase.from('public_users').select().eq('id', pid).single();
      if (data) {
        await addUser(data);
      }
      return data;
    } 
  }

  useEffect(()=>{
    getCommissioner();
  }, [meta.publicID])

  const addUser = async (u) => {
    let user;
    if (typeof u === 'number') {
      if (u) {
        const {data: uwu} = await supabase.from('public_users').select().eq('id', u).single();
        user = uwu?uwu:undefined;
      }
    } else {
       user = u;
    }
    if (user) {
      let contains = false;
      let length = users?.length;
      for (let i = 0; i < length; ++i) {//does
        if (users[i]) {
          contains ||= (users[i].id===user.id && 
                        users[i].email===user.email &&
                        users[i].username===user.username //uniqeness contrainst only applies on these fields this is enough to verify the closeness of user
            );
        } 
      }
      if (!contains) {
        let shallow = [...users] //get a shallow copy
        shallow.push(user);
        setUsers(shallow);
        //make change
      }
    }

  };
  
  //   const array = [...users]
  //   const index = array.indexOf(user);
  //   if (index > -1) { 
  //     array.splice(index, 1); 
  //   }
  //   setUsers(array);
  const remove = async (user) => {
    const commish = await getCommissioner();
    if (commish.id===user.id && 
        commish.email===user.email &&
        commish.username===user.username //uniqeness contrainst only applies on these fields this is enough to verify the closeness of user
  ) 
  {
    //do nothing
    return;
  }
    let length = users?.length;
    for (let i = 0; i < length; ++i) {//does
      if (users[i]) {
        if (users[i].id===user.id && 
            users[i].email===user.email &&
            users[i].username===user.username //uniqeness contrainst only applies on these fields this is enough to verify the closeness of user
        ) 
        {
          let shallow = [...users] //get a shallow copy
          shallow.splice(i, 1); 
          setUsers(shallow);
          break;
        }
      }
    }
  }
  
  const handleNameChange = (e) => {
    setName(e.target.value);
  };



  const getCommissionerID = async () => {
    let commish = await supabase.from("commissioners").select('commissionerID').eq('userID', user.id);
    if (commish.data && commish.data.length > 0) {
      const commissionerID = commish.data[0].commissionerID;
      return commissionerID;
    }
  }

  const handleSubmit = async (e) => {
    if (!name) {
      alert("Enter a group name.")
      return;
    }
    e.preventDefault();
  
    //insert into group
    let commish = await getCommissionerID(); 
    let groupID = Math.floor((Math.pow(2, 31)-1) * Math.random()); 
                            // PREVIOUS VERSION WITH BIGINT
                            // if this ever collides on 'groups' 
                            // insert i am going to become a hermit 
                            // and prove there are finite numbers
                            // in the entire universe

    let groupData = {
      groupID: groupID,
      commissionerID: commish,
      groupName: name
    };
    const { error } = await supabase.from("groups").insert(groupData);
    if (error) {
      failed(error);
    }

      //insert relations into user_group  
      let a  = true;     
      for (const user of users) {
        let user_group = {
          userID: user.id,
          groupID: groupID,
        };
        const { error } = await supabase.from('user_groups').insert(user_group)
        if (error) {
          failed(error);
          a = false;
        }
        if (a) {
          succeed();
        }
      }
  }

  return (
    <div className="create-group page">
      <div className="creategroup-header"><h3>Create Group</h3><br/></div>
      <div >
        <div className="title-label-label">Group Name{" "}</div>
        <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e)}
            required
            style={{fontSize:"inherit", width: "100%", margin: "10px 0px 10px 0px"}}/>
        <FindUserList 
            users={users} 
            addUser={addUser}
            create={true}
            remove={remove}
          />
        <div className="btn-cntr">
          <button className="create-group submit" onClick={handleSubmit}>Create</button>
        </div>
     </div>
    </div>
  );
}
