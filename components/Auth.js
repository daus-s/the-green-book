'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { useAuth } from "./providers/AuthContext";

export default function Auth(props) {
  const { login } = useAuth();
  const [usr, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);

  const router = useRouter();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(usr, password);
      // const path = sessionStorage.get('authRedirectPath'); //this is erroring
      // if (path) {
      //   navigate(path);
      // } else {
      router.push("/bets");
      // }
    } catch (error) {
      //console.error(error);
      setInvalid(true);
      setPassword("");
    }
  };
  //supabase cnx
  return (
    <div className="auth-login page">
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
            onChange={(e) => setUser(e.target.value)}
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
      <div className="link-box">
        <a href="/sign-up">Create an Account</a>
        <a className="forgot-password" href="/forgot-password">Forgot your password?</a>
      </div>
    </div>
  );
}
