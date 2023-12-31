import "../styles/auth.css";

export default function NewUser() {
  const insertUser = async () => {};
  //validate email

  return (
    <div className="new-user">
      <form>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column" }}
        >
          <label>Email</label>
          <input type="text" className="email-field"></input>
        </div>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column" }}
        >
          <label>Password</label>
          <input type="password" className="password-field"></input>
        </div>
        <div
          style={{ margin: "10px", display: "flex", flexDirection: "column" }}
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
            style={{ fontSize: "larger" }}
          ></input>
        </div>
        <div className="user-pics"></div>
        <button className="create" type="submit">
          Create Account
        </button>
      </form>
      <a href="/SignIn">Sign In</a>
    </div>
  );
}
