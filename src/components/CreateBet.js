import { useEffect, useState } from "react";

import "../styles/createbet.css";


import { validOdds, validLine, formatOdds, getNumber } from "../functions/ParseOdds";
import { getComplementary } from "../functions/CalculateProbabilities";
import { supabase } from "../functions/SupabaseClient";

import { useAuth } from "./providers/AuthContext";
import { useModal } from "./providers/ModalContext";


export default function CreateBet(props) {
  // type of bet
  const [type, setType] = useState("ou");
  // line for over/under assumes 50/50 distribution
  const [line, setLine] = useState("");
  // list of odds for option bets
  const [odds, setOdds] = useState([{title:"", odds: ""},{title:"", odds: ""}]);

  // moneyline odds
  const [hit, setHit] = useState("");
  const [miss, setMiss]= useState("");

  // title and description 
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  //group data
  const [groups, setGroups] = useState([]);
  const [group, setGroup] = useState(-1);

  //custom hooks
  const { user, session } = useAuth();
  const {succeed, failed} = useModal();


  const getCommissioner = async () => {
    let commish = await supabase.from("commissioners").select('commissionerID').eq('userID', user.id);
    if (commish.data && commish.data.length > 0) {
      const commissionerID = commish.data[0].commissionerID;
      return commissionerID;
    }
  }

  useEffect(() => {
    const getGroups = async () => {
      if (user) {
        let c = await getCommissioner();
        if (c) {
          const groupData = await supabase.from("groups").select().eq('commissionerID', c);
          setGroups(groupData.data);
        }
        else {
          //not a commish
        }
      }
    }

    getGroups();
  }, [user, session])

  const handleLineChange = (e) => {
    let val = e.target.value;
    if (validLine(val)) {
      setLine(val);
    }
  }
  const overunder = (
    <div className="over-under-input">
      <label name="Line">
        Line
      </label>
      <input
        className="spec-input"
        name="Line"
        type="text"
        onChange={handleLineChange}
        value={line}
        placeholder="0.5"
      />
      </div>
    );

    const handleSelect = (e) => {
      if (e.target.value==="") {
        setGroup(-1);
      } else {
        setGroup(e.target.value);
      }
    }

    const addOdds = (e) => {
      e.preventDefault();
      let copy = [...odds];
      setOdds([...copy, {title: "", odds: "" }]);
    }
    const removeOdds = (e, indexToRemove) => {
      e.preventDefault();
      let copy = [...odds];
      let newArray = copy.filter((_, index) => index !== indexToRemove);
      setOdds(newArray);
    }

    // Function to resize the textarea based on its content
    const resizeTextarea = () => {
      const textarea = document.getElementById('auto-resize-textarea');
      textarea.style.height = 'auto'; // Reset the height to auto
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to the scrollHeight
    };
  
    // Event handler for textarea content changes
    const handleTextareaChange = (e) => {
      setContent(e.target.value);
      resizeTextarea();
    };

    const handleHitChange = (e) => {
      let val = e.target.value;
      if (validOdds(val)) {
        setHit(val);
      }
    }

    const handleMissChange = (e) => {
      let val = e.target.value;
      if (validOdds(val)) {
        setMiss(val);
      }
    }

    const handleBlur = (e) => {
      if (e.target.name=="miss") {
        setHit(formatOdds(getComplementary(formatOdds(getNumber(e.target.value)))));
      }
      if (e.target.name=="hits") {
        setMiss(formatOdds(getComplementary(formatOdds(getNumber(e.target.value)))));
      }    
    }

    const handleOOChange = (e, i, mode) => {
      let shallow = [...odds];
      let change = odds[i];
      if (mode=="title") {
        change.title = e.target.value;
      }
      if (mode=="odds") {
        if (validOdds(e.target.value)) {
          change.odds = e.target.value;
        }
      }
      shallow[i] = change;
      setOdds(shallow);
    }

    const options = (
      <div className="options-input">
        <table>
          <thead>
            <tr><td>Option</td><td>Odds</td></tr>
          </thead>
          <tbody>
          {odds.map((value, index) => (
            <tr key={index}>
                <td>
                  <input 
                    type="text"
                    value={odds[index].title}
                    onChange={(e) => handleOOChange(e, index, "title")}
                    required = {(index < 2) || odds[index].odds!==""}
                    />
                  </td>
                <td> 
                  <input 
                    type="text"
                    value={odds[index].odds}
                    onChange={(e) => handleOOChange(e, index, "odds")}
                    required = {(index < 2) || odds[index].title!==""}
                  />
                </td>
                {
                  index>1?
                  <div className="remove-option"><button className="remove-button" onClick={(e)=>removeOdds(e, index)}><img src="remove.png" alt="remove the option. constraint is a minimum of two options per bet"></img></button></div>:
                  <div/>
                  }
              </tr>
            ))
          }
          <div className="add-option"><button className="add-button" onClick={addOdds}><img src="add.png"/><div className="add-btn-txt">Add option</div></button></div>
          </tbody>
        </table>
      </div>
    );


    const moneyline = (
      <div className="moneyline-input">
        <div className="hit-input">
          <label
            name="hits"
          >Hits odds</label>
          <input
            name="hits"
            type="text"
            className="spec-input"
            value={hit}
            onChange={handleHitChange}
            placeholder="+100"
            onBlur={handleBlur}
          />
        </div>
        <div className="miss-input">
          <label
            name="miss"
          >Miss odds</label>
          <input
            name="miss"
            type="text"
            className="spec-input"
            value={miss}
            onChange={handleMissChange}
            placeholder="-100"
            onBlur={handleBlur}
          />
          </div>
      </div>
      );

    const handleSubmit = async (e) => {
      e.preventDefault();
      //big logic
      const biggerJson = {};
      if (type=="op") {
        odds.forEach((json)=>{
          if (json.odds && json.title) {
            if (json.odds=="" || json.title=="") {
              return; //dont submit
            } else {
              biggerJson[json.title] = json.odds;
            }    
          }
        });
      }
      if (type=="ou") {
        biggerJson.over = "+100";
        biggerJson.under = "-100";
      }
      if (type=="ml") {
        if (hit&&miss) {
          biggerJson.hits = hit;
          biggerJson.misses = miss;
        } else {
          biggerJson = null;
        }
      }
      let c = await getCommissioner();
      //insert into bets
      /**
       * type=="ou"?(line?true:false):true
       *  means if the bet is an over under bet check f the line is valid 
       *  meaning exists (validity of line is enforced in js is bypassable by script tampering )
       * 
       *  if its not over under then dont need to check the line value
       */
      if (title && (type=="ou"?line?true:false:true) && biggerJson && c && group!=-1) { 
        //check title -- check line if OU          -- check odds  -- check commish
        const bet = {
          title: title, 
          description: content, 
          odds: biggerJson, 
          open: true, 
          commissionerID: c, 
          mode: type, 
          line:(type=="ou"?line:null), 
          groupID: group,
          creationtime: new Date().toISOString()
        };
        const {error} = await supabase
                                .from('bets')
                                .insert(bet); //ß i want hieroglyphics in my comments
        if (!error) {
          setLine("");
          setTitle("");
          setContent("");
          setOdds([{title:"", odds: ""},{title:"", odds: ""}]);
          setHit("");
          setMiss("");
          setGroup("");
          succeed();
        } else {
          failed(error);
        }
      }
    }




  return (
    <div className="create-bet">
      <h1 style={{fontSize:"2.5em"}}>Create Bet</h1>
      <form onSubmit={handleSubmit}>
        <div className="box">
          <div className="left-column">
            <div className="input-row">
              <label name="title">Title</label>
              <input type="text" name="title" value={title} onChange={(e)=>setTitle(e.target.value)} required/>
            </div>
            <div className="input-row">
              <label name="description">Description</label>
              <textarea 
              id="auto-resize-textarea"
              name="description"
              value={content}
              onChange={handleTextareaChange}
              placeholder="Type here..."
               />
            </div>
          </div>
          <div className="right-column">
            <div className="select-corner">
              <label>Select Group</label>
              <select value={group} onChange={handleSelect}>
                <option value={-1}></option>
                {groups.map((group, index) => (
                  <option key={index} value={group.groupID}>
                    {group.groupName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="bet-radio">
          <label className="radio-label">
            <input 
              type="radio" 
              name="betType" 
              value="ou" 
              className="real-radio" 
              onChange={(e)=>setType(e.target.value)} 
              checked={type === "ou"}
            />
            <div className="custom-radio">
              Over-Under
            </div>
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="betType" 
              value="ml" 
              className="real-radio" 
              onChange={(e)=>setType(e.target.value)} 
              checked={type === "ml"}
            />
            <div className="custom-radio">
              Moneyline
            </div>
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="betType" 
              value="op" 
              className="real-radio" 
              onChange={(e)=>setType(e.target.value)} 
              checked={type === "op"}
            />
            <div className="custom-radio">
              Options
            </div>
          </label>
        </div>
        {type=="ou" ? overunder : (
          type=="ml"? moneyline : (
            type=="op" ? options : <div></div>
            )
          )
        }
        <button>Submit</button>
      </form>
    </div>
  );
}
