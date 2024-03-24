import Link from 'next/link';
import { useAuth } from "./providers/AuthContext";
import AccountControl from "./AccountControl";
import Logo from "./Logo";
import { useMobile } from './providers/MobileContext';
import { useMediaQuery } from '@mui/material';


export default function Header({nav}) {
  const {isMobile} = useMobile();
  const xtraWide = useMediaQuery('(min-width: 1397px)');
  const {meta} = useAuth();
  const cs = meta&&meta.commish;
  //solve the fencepost problem
  return (
    <header>
      <Logo />
      {
      (!isMobile)&&nav ?
      <nav>
        <Link href="/bets" style={cs?{width:'12.5%', border: 'none'}:{width:'25%', border: 'none'}}><img src="bet.png" alt="bets menu" className="link-image"/>{xtraWide?'Bet':<></>}</Link>
        <Link href="/history" style={cs?{width:'12.5%'}:{width:'25%'}}><img src="history.png" alt="betting history" className="link-image"/>{xtraWide?'History':<></>}</Link>
        <Link href="/wallet" style={cs?{width:'12.5%'}:{width:'25%'}}><img src ='balance.png' alt="balance and wallet" className="link-image"/>{xtraWide?'Balance':<></>}</Link>
        <Link href="/social" style={cs?{width:'12.5%'}:{width:'25%'}}><img src="social.png" alt="social" className="link-image"/>{xtraWide?'Groups':<></>}</Link>
        {
        cs?
        (
        <>
          <Link href="/new-group" style={cs?{width:'12.5%'}:{width:'25%'}}><img src="creategroup.png" alt="create group" className="link-image"/>{xtraWide?'New Group':<></>}</Link>
          <Link href="/your-groups" style={cs?{width:'12.5%'}:{width:'25%'}}><img src="groupsettings.png" alt="manage groups" className="link-image"/>{xtraWide?'Group Settings':<></>}</Link>
          <Link href="/new-bet" style={cs?{width:'12.5%'}:{width:'25%'}}><img src="newbet.png" alt="create bet" className="link-image"/>{xtraWide?'New Bet':<></>}</Link>
          <Link href="/bookkeeping" style={cs?{width:'12.5%'}:{width:'25%'}}><img src="bookkeeping.png" alt="bookkeeping and bet manager" className="link-image"/>{xtraWide?'Bookkeeper':<></>}</Link>       
        </>
        )
        :
        <></>
        }
      </nav>
      :
      <></>
      }
      <AccountControl />
    </header>
  );
}
