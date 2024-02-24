import "../styles/header.css";

import { Link } from 'react-router-dom';
import { useAuth } from "./providers/AuthContext";
import AccountControl from "./AccountControl";
import Logo from "./Logo";


export default function Header() {
  const {meta} = useAuth();
  return (
    <header>
      <Logo />
      <nav>
        <Link to="/bets">Your Bets</Link>
        <Link to="/bets-placed">Bets Placed</Link>
        <Link to="/wallet">Balance</Link>
        <Link to="/social">Groups</Link>
        {
        meta.commish?
        (
        <>
          <Link to="/create-group">Create Group</Link>
          <Link to="/your-groups">Manage Groups</Link>
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
