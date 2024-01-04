import { useState } from "react";
import "../styles/auth.css";

import { useNavigate } from "react-router-dom";

import { useAuth } from "./AuthContext";

export default function Auth(props) {
  const {user, session, login, logout} = useAuth();
  const [usr, setUsr] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(usr, password);
      if (props.src){
        navigate("/"+props.src);
      } else {
        navigate("/bets")
      }
    } catch (error) {
      //console.error(error);
      setInvalid(true);
      setPassword("");
    }
  };
  //supabase cnx
  return (
    <div className="auth-login">
      <img src="greenbook.jpg" alt={"The Green Book logo."} className="biglogo"/>
      <form onSubmit={handleLogin}>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column" }}
        >
          <label>Email</label>
          <input
            className="email"
            type="text"
            value={usr}
            onChange={(e) => setUsr(e.target.value)}
            style={{ width: "400px" }}
            required
          />
        </div>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column" }}
        >
          <label>Password</label>
          <input
            className="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "400px" }}
            required
          />
        </div>
        {invalid?<span className="error"><b>Error: </b>Incorrect username or password</span>:<br/>}
        <button className="signin" type="submit">
          Log-in
        </button>
      </form>
      <a href="/sign-up">Create an Account</a>
    </div>
  );
}
