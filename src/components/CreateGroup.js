import { supabase } from "../functions/SupabaseClient";
import "../styles/creategroup.css";

import { useState } from "react";

import { useAuth } from "./providers/AuthContext";
// import { random } from "../functions/RandomBigInt"; # bigint deprecated pre-release
import { useModal } from "./providers/ModalContext";

export default function CreateGroup(props) {
  const [users, setUsers] = useState(["",""]);
  const [errors, setErrors] = useState([false, false]);
  const [name, setName] = useState("");

  const { user, meta } = useAuth();
  const { failed, succeed } = useModal();

  const addUser = () => {
    setUsers([...users, ""]);
    setErrors([...errors, false]);
  };

  const handleUserChange = (index, value) => {
    let shallow = [...users];
    shallow[index] = value;
    setUsers(shallow);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const remove = (index) => {
    let userCopy = [...users];
    let errCopy = [...errors];
    if (userCopy.length>2) {
      userCopy.splice(index, 1);
      errCopy.splice(index, 1);
      setUsers([...userCopy]);
      setErrors([...errCopy]);
    }
  };

  const getCommissioner = async () => {
    let commish = await supabase.from("commissioners").select('commissionerID').eq('userID', user.id);
    if (commish.data && commish.data.length > 0) {
      const commissionerID = commish.data[0].commissionerID;
      return commissionerID;
    }
  }

  const validate = async (entry) => {
    const {data, error} = await supabase.from("public_users").select("id").or(`username.eq.${entry},email.eq.${entry}`);
    if (data)
      return !data.length>0
    return true;
  };

  const validateAll = async () => {
    const truths = await Promise.all(users.map(validate));
    setErrors(truths);
    return truths.some((element) => element);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateAll())) {
      let ids = [];
      for (const u of users) {
        const { data, error } = await supabase.from("public_users").select("id").or(`username.eq.${u},email.eq.${u}`);
        if (data) {
          ids.push(data[0].id);
        }
      }

      //insert into group
      let commish = await getCommissioner(); 
      let groupID = Math.floor((Math.pow(2, 31)-1) * Math.random()); 
                              // PREVIOUS VERSION WITH BIGINT
                              // if this ever collides on 'groups' 
                              // insert i am going to become a hermit 
                              // and prove there are finite numbers
                              // in the entire universe

      let groupData = {
        groupID: groupID.toString(),
        commissionerID: commish,
        groupName: name
      };
      const { error } = await supabase.from("groups").insert(groupData);
      let a  = true
      if (error) {
        failed(error);
        a = false;
      }

      //insert relations into user_group 
      /* See if the groupID can now be passed as a integer number not a string */
      await supabase.from('user_groups').insert({userID: meta.publicID, groupID: groupID});
      for (const id of ids) {
        let user_group = {
          userID: id,
          groupID: groupID,
        };
        const {error} = await supabase.from('user_groups').insert(user_group)
        if (error) {
          failed(error);
          a = false;
        }
        if (a) {
          succeed();
        }
      }
    }
  };

  return (
    <div className="create-group page">
      <div className="creategroup-header"><h3>Create Group</h3><br/></div>
      <form onSubmit={handleSubmit}>
        <table>
          <thead             
            style={{fontSize: "20px", alignItems: "center"}}
          >
            <span>Enter Group Name{" "}</span>
            <input
            type="text"
            value={name}
            onChange={(e) => handleNameChange(e)}
            required
            style={{fontSize:"inherit", width: "59%"}}
            >
            </input>
          </thead>
          <tbody>
            <p className="add0">*Add user emails or usernames to the list.*</p>
            {users.map((user, index) => (
              <div key={index}>
                <tr key={index}>
                  <td style={{position:"relative"}}>Email or username{errors[index]?<div className="error table-message">User doesn't exist</div>:<div className="error table-message"/>}</td>
                  <td>
                    <input
                      type="text"
                      value={user}
                      onChange={(e) => handleUserChange(index, e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <button className="remove" onClick={() => remove(index)}>
                      <img src="remove.png" />
                    </button>
                  </td>
                </tr>
              </div>
            ))}
          </tbody>
        </table>
        <div className="btn-ctnr">
          <button className="add-user-button" onClick={() => addUser()}>
            Add User
          </button>
          <button className="create-group-button" type="submit">Create Group</button>
        </div>
      </form>
    </div>
  );
  //make sure to call validate on each email
}
