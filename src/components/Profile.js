import ProfileSelection from "./ProfileSelection";

import { useAuth } from "./AuthContext";
import { useEffect, useState } from "react";

import { supabase } from "../functions/SupabaseClient";
import { alpha, validUsername } from "../functions/isEmail";

import "../styles/profile.css";

export default function Profile(props) {
  const [editName, setEditName] = useState(false);
  const [editUsername, setEditUsername] = useState(false);
  const [choosePFP, setChoosePFP] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [pfp, setPFP] = useState("");

  const [email, setEmail] = useState("");

 
  const { user, meta, session } = useAuth();



  const changeName = (e) => {
    if (alpha(e.target.value)) {
      setName(e.target.value);
    }
  };

  const changeUsername = (e) => {
    if (validUsername(e.target.value)) {
      setUsername(e.target.value);
    }
  };

  const callUpdateName = async (e) => {
    e.preventDefault();
    
    const { error } = await supabase.from("users").update({ name: name }).eq("userID", user.id);
    if (!error) {
      setEditName(false);
    }

  };

  const callUpdateUsername = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("users").update({ username: username }).eq("userID", user.id);
    if (!error) {
      setEditUsername(false); //todo keep foreign key op on public _users
    }
  }

  const toggleEditPic = () => {
    setChoosePFP((prev)=>(!prev));
  }

  useEffect(() => {
    if (user&&session) {
      const getUserData = async () => {
        const { data, error } = await supabase.from("users").select().eq("userID", user.id);
        setEmail(data[0].email);
        setUsername(data[0].username);
        setName(data[0].name);
      };
      getUserData();
    }
  }, [user, session]);

  return (
    <div className="profile">
      <div className="profile-data">
        <div className="profile-pic">
          <div className="pfp-img">
            <img src={meta.pfp} alt = "Profile picture." style={{height:"112px", borderRadius: "50%"}}/>
          </div>
          <div className="edit-box">
            <div className="edit">
              <img src="write.png" style={{height: "24px", alignSelf: "flex-end"}} onClick={toggleEditPic}/>
            </div>
          </div>
        </div>
        <div className="user-data">
          {
            editName
            ?
            <form className="edit-name" onSubmit={(e)=>callUpdateName(e)}>
              <input value={name} onChange={(e)=>changeName(e)} required/>
              <button className="submit-change" type="submit"><img src="submit.png" alt="Confirm change." style={{height: "24px", alignSelf: "flex-end"}}/></button>
            </form>
          :
            <div className="name">
              {name} 
              <div className="edit" onClick={()=>setEditName(true)}><img src="write.png" alt="Edit name." style={{height: "24px", alignSelf: "flex-end"}}/></div>
            </div>
          }
          {
            editUsername
            ?
            <form className="edit-username" onSubmit={(e)=>callUpdateUsername(e)}>
              <input value={username} onChange={(e)=>changeUsername(e)} required/>
              <button className="submit-change" type="submit"><img src="submit.png" alt="Confirm change." style={{height: "24px", alignSelf: "flex-end"}}/></button>
            </form>
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
      {choosePFP?<ProfileSelection close={setChoosePFP}/>:""} 
    </div>
  );
}