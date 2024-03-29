import { supabase } from "../functions/SupabaseClient";
import { useEffect, useState } from "react";
import { validEmail, validUsername } from "../functions/isEmail";
import { useAuth } from "./providers/AuthContext";
import { useRouter } from "next/router";
import { useMobile } from "./providers/MobileContext";

export default function NewUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const[usernameError, setUsernameError] = useState(false);
  const[emailError, setEmailError] = useState(false);
  const[usernameSyntaxError, setUsernameSyntaxError] = useState(false);
  const[emailSyntaxError, setEmailSyntaxError] = useState(false);

  const router = useRouter();
  const { login } = useAuth();
  const { isMobile } = useMobile();

  useEffect(()=> {
    setEmailSyntaxError(!validEmail(email)&&email!=='');
    setUsernameSyntaxError(!validUsername(username)&&username!=='');
  }, [username, email]);

  const insertUser = async () => {
    const usernameExists = await supabase.from("public_users").select().eq("username", username.toLowerCase());
    const pwd = password;
    setPassword("");
    if (usernameExists.data.length > 0) {
      //error do not proceed
      setUsernameError(true);
      return;
    } 
    else {
      setUsernameError(false);
    }
    const emailExists = await supabase.from("public_users").select().eq("email", email.toLowerCase());
    if (emailExists.data.length > 0) {
      setEmailError(true);
      return;
    } 
    else {
      setEmailError(false);  
    }
    const signupResponse = await supabase.auth.signUp(
      {
      email: email.toLowerCase(),
      password: pwd,
    });
    if (signupResponse.error)
    {
      if (signupResponse.error.message=="User already registered") {
        setEmailError(true);
        return;
      }
    }
    else {
      const insertResponse = await supabase.from("users").insert(
        {
          userID: signupResponse.data.user.id,
          name: name,
          email: email.toLowerCase(),
          username: username.toLowerCase(),
        }
      );
      if (!insertResponse.error&&signupResponse.data) {
        const path = await login(username?username:email?email:undefined, pwd);
        if (path) {
          router.push(`${path}`);
        } else {
          router.push('/bets');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailSyntaxError(!validEmail(email));
    setUsernameSyntaxError(!validUsername(username));
    if ((!emailSyntaxError || validEmail(email)) && (!usernameSyntaxError || validUsername(username))) {
      insertUser();
    }
  }

  return (
    <div className="new-user page no-header">
      <img src="greenbook.jpg" alt="The Green Book logo." className="biglogo"/>
      <form onSubmit={handleSubmit} style={isMobile?mobileStyle.input:{}}>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column" , ...isMobile?mobileStyle.input:{}}}
          >
          <label>Email</label>
          <input 
            type="text" 
            className="email-field" 
            value={email}
            onChange={(e)=>{setEmail(e.target.value)}}
            style={isMobile?mobileStyle.input:{}}
            required
          ></input>
          {emailSyntaxError?<span className="error">Please enter a valid email.</span>:emailError?<span className="error" >Email is already in use.</span>:""}
        </div>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column" , ...isMobile?mobileStyle.input:{}}}
          >
          <label>
            
            Username{" "}
          </label>
          <input
            type="text"
            className="username-field"
            value={username}
            onChange={(e)=>{setUsername(e.target.value)}}
            style={isMobile?mobileStyle.input:{}}
            required
          ></input>
          {usernameSyntaxError?<span className="error">Please use a alphanumeric username.</span>:usernameError?<span className="error" >Username is already in use.</span>:""}
        </div>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column" , ...isMobile?mobileStyle.input:{}}}
        >
          <label>Password</label>
          <input 
            type="password" 
            className="password-field" 
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
            style={isMobile?mobileStyle.input:{}}
            required
          />
        </div>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column" , ...isMobile?mobileStyle.input:{}}}
          >
          <label>
            Name{" "}
            <span className="note-span">
              (This is what other users will see.)
            </span>
          </label>
          <input
            type="text"
            className="name-field"
            style={{  fontSize: "larger", width: "400px", ...isMobile?mobileStyle.input:{} }}
            onChange={(e)=>{setName(e.target.value)}}
            value={name}
            required
          ></input>
        </div>
        
        <div className="user-pics"></div>
        <button className="create" type="submit">
          Create Account
        </button>
      </form>
      <a href="/login">Sign In</a>
    </div>
  );
}

const mobileStyle = {
  form: {
    width: 'calc(100% - 16px)',
  },
  input: {
    maxWidth: '100%',
    width: 'calc(100% - 16px)',
  }
}