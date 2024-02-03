import "../styles/header.css";

import { Link } from 'react-router-dom';
import { useAuth } from "./AuthContext";
import AccountControl from "./AccountControl";


export default function Header() {
  const {user, meta} = useAuth();
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
        {
        meta.commish?
        (
        <>
          <Link to="/create-group">Create Group</Link>
          <Link to="/your-groups">Groups</Link>
          <Link to="/create-bet">Create Bet</Link>
          <Link to="/manage-bets">Bet Manager</Link>       
        </>
        )
        :
        <></>
        }
      </nav>
      <AccountControl />
    </header>
  );
}
