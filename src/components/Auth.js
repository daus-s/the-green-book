import { useState } from "react";
import "../styles/auth.css";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    // e.preventDefault();
    // try {
    //   const { user, error } = await supabase.auth.signIn({
    //     email,
    //     password,
    //   });
    //   if (error) {
    //     console.error(error.message);
    //     // Handle error (e.g., show error message to the user)
    //   } else {
    //     console.log("User signed in:", user);
    //     // Redirect or perform other actions after successful login
    //   }
    // } catch (error) {
    //   console.error("Error during sign in:", error.message);
    // }
  };
  //supabase cnx
  return (
    <div className="auth-login">
      <form onSubmit={handleLogin}>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column" }}
        >
          <label>Email</label>
          <input
            className="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "400px" }}
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
          />
        </div>
        <button className="signin" type="submit">
          Log-in
        </button>
      </form>
      <a href="/NewUser">Create an Account</a>
    </div>
  );
}
