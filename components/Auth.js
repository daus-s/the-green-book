'use client'

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { useAuth } from "./providers/AuthContext";
import { useMobile } from "./providers/MobileContext";

export default function Auth() {
  const { login } = useAuth();
  const [usr, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [invalid, setInvalid] = useState(false);

  const router = useRouter();
  const { isMobile } = useMobile();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const path = await login(usr, password);
      if (path) {
        router.push(`${path}`);
      } else {
        router.push('/bets');
      }
    } catch (error) {
      setInvalid(true);
      setPassword("");
    }
  };
  //supabase cnx
  return (
    <div className="auth-login page">
      <img src="greenbook.jpg" alt={"The Green Book logo."} className="biglogo"/>
      <form onSubmit={handleLogin} style={isMobile?mobileStyle.form:{}}>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column", ...isMobile?mobileStyle.input:{} }}
        >
          <label>Username</label>
          <input
            className="email"
            type="text"
            value={usr}
            onChange={(e) => setUser(e.target.value)}
            style={{ width: "400px", ...isMobile?mobileStyle.input:{} }}
            required
          />
        </div>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column", ...isMobile?mobileStyle.input:{} }}
        >
          <label>Password</label>
          <input
            className="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "400px", ...isMobile?mobileStyle.input:{} }}
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

const mobileStyle = {
  form: {
    width: 'calc(100% - 16px)',
  },
  input: {
    maxWidth: '100%',
    width: 'calc(100% - 16px)',
  }
}