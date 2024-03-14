import Link from 'next/link';
import { useAuth } from "./providers/AuthContext";
import AccountControl from "./AccountControl";
import Logo from "./Logo";
import { useMobile } from './providers/MobileContext';


export default function Header() {
  const {isMobile} = useMobile();
  const {meta} = useAuth();
  return (
    <header>
      <Logo />
      {
      isMobile &&
      <nav>
        <Link href="/bets">Your Bets</Link>
        <Link href="/bets-placed">Bets Placed</Link>
        <Link href="/wallet">Balance</Link>
        <Link href="/social">Groups</Link>
        {
        meta.commish?
        (
        <>
          <Link href="/create-group">Create Group</Link>
          <Link href="/your-groups">Manage Groups</Link>
          <Link href="/create-bet">Create Bet</Link>
          <Link href="/manage-bets">Bet Manager</Link>       
        </>
        )
        :
        <></>
        }
      </nav>}
      <AccountControl />
    </header>
  );
}
