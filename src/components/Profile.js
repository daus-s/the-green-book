import { useState } from "react";

export default function Profile(props) {
  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const user = { name: "Chad" };
  return (
    <div className="profile">
      <img className="pfp" src="profile.png" alt={user.name} />
      {editName ? (
        <form>
          <input type="text"></input>
        </form>
      ) : (
        <div className="profile-field">
          <div className="text">{user.name}</div>
          <button className="edit">
            <img src="edit.png" />
          </button>
        </div>
      )}
      {
        //duplicate
      }
      {
        //duplicate
      }
    </div>
  );
}
