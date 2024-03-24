import ProfileSelection from "./ProfileSelection";
import { useAuth } from "./providers/AuthContext";
import { useModal } from "./providers/ModalContext";
import { useMobile } from "./providers/MobileContext";
import { useEffect, useState } from "react";
import { supabase } from "../functions/SupabaseClient";
import { alpha, validUsername } from "../functions/isEmail";
import CommissionerShield from "./CommissionerShield";

export default function Profile() {
  const [editName, setEditName] = useState(false);
  const [editUsername, setEditUsername] = useState(false);
  const [choosePFP, setChoosePFP] = useState(false);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

 
  const { user, meta, session } = useAuth();
  const { failed, succeed } = useModal();
  const { isMobile } = useMobile();



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
    if (error) {
      failed(error);
    }
    else if (!error) {
      succeed();
      setEditName(false); //todo keep foreign key op on public _users
    }
  };

  const callUpdateUsername = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("users").update({ username: username }).eq("userID", user.id);
    if (error) {
      failed(error);
    }
    else if (!error) {
      succeed();
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
    <div className="profile page">
      <div className="profile-data" style={isMobile?mobileStyle.profileData:{}}>
        <div className="profile-pic" style={isMobile?mobileStyle.profilePic:{}}>
          <div className="pfp-img">
            <img src={meta&&meta.pfp?meta.pfp:'user.png'} alt = "Profile picture." style={{height:"112px", borderRadius: "50%"}}/>
            {meta.commish?<CommissionerShield style={{height: '44px', pointerEvents: 'none', transform: 'translateY(27%) translateX(calc(50% - 12px))'}}/>:<></>}
          </div>
          <div className="edit-box">
            <div className="edit">
              <img src="write.png" style={{height: "24px", alignSelf: "flex-end"}} onClick={toggleEditPic}/>
            </div>
          </div>
        </div>
        {isMobile&&choosePFP?<ProfileSelection close={setChoosePFP}/>:""} 
        <div className="user-data" style={isMobile?mobileStyle.userData:{}}>
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
          <div className="reset-password-link" style={isMobile?mobileStyle.passwordReset:{}}>
            <a href="/reset-password">Change your password</a>
          </div>
        </div>
      </div>
      {!isMobile&&choosePFP?<ProfileSelection close={setChoosePFP}/>:""} 
    </div>
  );
}

const mobileStyle = {
  profileData: {
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
  },
  profilePic: {
    flexDirection: 'row',
    alignItems: 'center',
    transform: 'translateX(34px)',
  },
  userData: {
    maxWidth: '100%',
    minWidth: '0px',
  },
  passwordReset: {
    justifyContent: 'center',
  }
}