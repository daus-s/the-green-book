import { useEffect, useState } from "react";
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
  const { user, meta } = useAuth();
  const {succeed, failed} = useModal();

  useEffect(() => {
    const getGroups = async () => {
      if (user) {
        let c = meta.commish;
        if (c) {
          const groupsYoureCommissionerOf = await supabase.from("groups").select().eq('commissionerID', c);
          const groupsYoureAMemberOf = await supabase.from('user_groups').select('groupID').eq('userID', meta.publicID);
          const groupIDsAsAList = (groupsYoureAMemberOf&&groupsYoureAMemberOf.data)?groupsYoureAMemberOf.data.map((obj)=>obj.groupID):undefined; 
          const collectiveGroupsYoureAMemberOf = await supabase.from("groups").select().eq('collective', true).neq('commissionerID', c).in('groupID', groupIDsAsAList?groupIDsAsAList:[]);
          const combined = [];
          if (groupsYoureCommissionerOf && groupsYoureCommissionerOf.data) {
            combined.push(...groupsYoureCommissionerOf.data);
          }
          if (collectiveGroupsYoureAMemberOf?.data) {
            combined.push(...collectiveGroupsYoureAMemberOf.data);
          }
          setGroups(combined);
        }
        else {
          //not a commish
        }
      }
    }

    getGroups();
  }, [user,meta])

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
      if (val.length == 1 && parseInt(val)) {
        setHit("+" + val); //imply positive odds
      } 
      else if (validOdds(val)) {
        setHit(val);
      }
    }

    const handleMissChange = (e) => {
      let val = e.target.value;
      if (val.length == 1 && parseInt(val)) {
        setMiss("+" + val); //imply positive odds
      } 
      else if (validOdds(val)) {
        setMiss(val);
      }
    }

    const handleBlur = (e) => {
      if (e.target.name=="miss") {
        let odds = formatOdds(getComplementary(formatOdds(getNumber(e.target.value))))
        if (!isNaN(odds)) {
          setHit(odds);
        }
      }
      if (e.target.name=="hits") {
        let odds = formatOdds(getComplementary(formatOdds(getNumber(e.target.value))))
        if (!isNaN(odds)) {
          setMiss(odds);
        }
      }    
    }

    const handleOptionsOddsChange = (e, i, mode) => {
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
                    onChange={(e) => handleOptionsOddsChange(e, index, "title")}
                    required = {(index < 2) || odds[index].odds!==""}
                    />
                  </td>
                <td> 
                  <input 
                    type="text"
                    value={odds[index].odds}
                    onChange={(e) => handleOptionsOddsChange(e, index, "odds")}
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
      let biggerJson = {};
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
      //unfortuantley this has to be a query into groups bc of collective groups
      let c = await supabase.from('groups').select('commissionerID').eq('groupID',group);
      if (c.data) {
        c=c.data
        if (c.length==1) {
          c = c[0].commissionerID;
        } else {
          c = meta.commish;
        }
      }
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
    <div className="create-bet page">
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
                {groups.map((group) => (
                  <option key={group.groupID} value={group.groupID}>
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
