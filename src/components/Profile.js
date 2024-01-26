import { useAuth } from "./AuthContext";

import { useEffect, useState } from "react";
import { supabase } from "../functions/SupabaseClient";

import "../styles/profile.css";

export default function Profile(props) {
  const [editName, setEditName] = useState(false);
  const [editUsername, setEditUsername] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const { user, session } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");


  const callUpdateName = async () => {
    const { data, error } = await supabase.from("users").update({ name: name }).eq("userID", user.id);
    if (data) {
      setEditName(false);
    }
  };


  const callUpdateUsername = async () => {
    const { data, error } = await supabase.from("users").update({ username: username }).eq("userID", user.id);
    if (data) {
      setEditUsername(false); //todo keep foreign key op on public _users
    }
    console.log("cum");
  }

  useEffect(() => {
      const getUserData = async () => {
          
          const { data, error } = await supabase.from("users").select().eq("userID", user.id);
          console.log(data?data:error);
          setEmail(data[0].email);
          setUsername(data[0].username);
          setName(data[0].name);
      };

      getUserData();
  }, [user, session]);

  return (
    <div className="profile">
      <div className="user-data">
        {
          editName
          ?
          <div className="edit-name">
            <input value={name}/>
            <button className="submit-change" onClick={callUpdateName}><img src="submit.png" alt="Confirm change." style={{height: "24px", alignSelf: "flex-end"}}/></button>
          </div>
        :
          <div className="name">
            {name} 
            <div className="edit" onClick={()=>setEditName(true)}><img src="write.png" alt="Edit name." style={{height: "24px", alignSelf: "flex-end"}}/></div>
          </div>
        }
        {
          editUsername
          ?
          <div className="edit-username">
            <input value={username}/>
            <button className="submit-change" onClick={callUpdateUsername}><img src="submit.png" alt="Confirm change." style={{height: "24px", alignSelf: "flex-end"}}/></button>
          </div>
          :
          <div className="username">
            {username} 
            <div className="edit" onClick={()=>{setEditUsername(true)}}><img src="write.png" alt="Edit username." style={{height: "24px", alignSelf: "flex-end"}}/></div>
          </div>
        }
        <div className="email">
            {email}
        </div>
      </div>
    </div>
  );
}