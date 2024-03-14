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
      !isMobile &&
      <nav>
        <Link href="/bets"><img src="bet.png" alt="bets menu" className="link-image"/></Link>
        <Link href="/bets-placed"><img src="history.png" alt="betting history" className="link-image"/></Link>
        <Link href="/wallet"><img src ='balance.png' alt="balance and wallet" className="link-image"/></Link>
        <Link href="/social"><img src="social.png" alt="social" className="link-image"/></Link>
        {
        meta.commish?
        (
        <>
          <Link href="/create-group"><img src="creategroup.png" alt="create group" className="link-image"/></Link>
          <Link href="/your-groups"><img src="groupsettings.png" alt="manage groups" className="link-image"/></Link>
          <Link href="/create-bet"><img src="newbet.png" alt="create bet" className="link-image"/></Link>
          <Link href="/manage-bets"><img src="bookkeeping.png" alt="bookkeeping and bet manager" className="link-image"/></Link>       
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
