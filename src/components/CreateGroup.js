import "../styles/creategroup.css";

import { useState } from "react";

export default function CreateGroup(props) {
  const [users, setUsers] = useState([]);

  const addUser = () => {
    setUsers([...users, ""]);
  };

  const handleUserChange = (index, value) => {
    let shallow = [...users];
    shallow[index] = value;
    setUsers(shallow);
  };

  const remove = (index) => {
    let shallow = [...users];
    shallow.splice(index, 1);
    setUsers([...shallow]);
  };

  const validate = () => {};

  return (
    <div className="create-group">
      <div className="creategroup-header">Create Group</div>
      <p className="add0">*Add user emails to the list.*</p>
      <table>
        <thead></thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>Email</td>
              <td>
                <input
                  type="text"
                  value={user}
                  onChange={(e) => handleUserChange(index, e.target.value)}
                />
              </td>
              <td>
                <button className="remove" onClick={() => remove(index)}>
                  <img src="remove.png" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="add-user-button" onClick={addUser}>
        Add User
      </button>
      <button className="create-group-button">Create Group</button>
    </div>
  );
  //make sure to call validate on each email
}
