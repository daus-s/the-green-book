import { useState } from "react";

import "../styles/createbet.css";


import { validOdds, validLine } from "../functions/ParseOdds";

const options = (
  <div>
    <div>
      <input/>
      <input/>
    </div>
    <div>
      <input/>
      <input/>
    </div>
  </div>
);


export default function CreateBet(props) {
  const [type, setType] = useState("overUnder");
  const [line, setLine] = useState("");
  const [odds, setOdds] = useState([{},{}]);
  const [hit, setHit] = useState("");
  const [miss, setMiss]= useState("");
  const [content, setContent] = useState('');



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

    const addOdds = () => {
      let copy = [...odds];
      setOdds([...copy, {}]);
    }
    const removeOdds = (index) => {
      let copy = [...odds];
      setOdds(copy.splice(index, 1));
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
          />
          </div>
      </div>
      );






  return (
    <div className="create-bet">
      <h1 style={{fontSize:"2.5em"}}>Create Bet</h1>
      <form>
        <div className="box">
          <div className="left-column">
            <div className="input-row">
              <label name="title">Title</label>
              <input type="text" name="title"/>
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
              <select>
                <option value=""></option>
                <option value="groupid">group.name</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bet-radio">
          <label className="radio-label">
            <input 
              type="radio" 
              name="betType" 
              value="overUnder" 
              className="real-radio" 
              onChange={(e)=>setType(e.target.value)} 
              checked={type === "overUnder"}
            />
            <div className="custom-radio">
              Over-Under
            </div>
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="betType" 
              value="moneyline" 
              className="real-radio" 
              onChange={(e)=>setType(e.target.value)} 
              checked={type === "moneyline"}
            />
            <div className="custom-radio">
              Moneyline
            </div>
          </label>
          <label className="radio-label">
            <input 
              type="radio" 
              name="betType" 
              value="options" 
              className="real-radio" 
              onChange={(e)=>setType(e.target.value)} 
              checked={type === "options"}
            />
            <div className="custom-radio">
              Options
            </div>
          </label>
        </div>
        {type=="overUnder" ? overunder : (
          type=="moneyline"? moneyline : (
            type=="options" ? options : <div></div>
            )
          )
        }
        <button>Submit</button>
      </form>
    </div>
  );
}
