import "../styles/header.css";

import { Link } from 'react-router-dom';


export default function Header() {
  return (
    <header>
      <div className="logo">
        <img src="greenbook.jpg" alt="Logo" />
        <div id="wordtitles">
          <h1>The Greenbook</h1>
          <h6>digitized</h6>
        </div>
      </div>
      <nav>
        <Link to="/bets">Your Bets</Link>
        <Link to="/bets-placed">Bets Placed</Link>
        <Link to="/wallet">Balance</Link>
        <Link to="/security">Security</Link>
        <Link to="/create-group">Create Group</Link>
        <Link to="/create-bet">Create Bet</Link>
      </nav>

      <button className="cta-button" onClick={()=>window.location.href='/login'}>Sign In</button>
    </header>
  );
}
