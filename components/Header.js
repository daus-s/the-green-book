import Link from 'next/link';
import { useAuth } from "./providers/AuthContext";
import AccountControl from "./AccountControl";
import Logo from "./Logo";
import { useMobile } from './providers/MobileContext';
import { useMediaQuery } from '@mui/material';


export default function Header() {
  const {isMobile} = useMobile();
  const xtraWide = useMediaQuery('(min-width: 1397px)')
  const {meta} = useAuth();
  return (
    <header>
      <Logo />
      {
      !isMobile ?
      <nav>
        <Link href="/bets" style={meta.commish?{width:'12.5%'}:{width:'25%'}}><img src="bet.png" alt="bets menu" className="link-image"/>{xtraWide?'Bet':<></>}</Link>
        <Link href="/history" style={meta.commish?{width:'12.5%'}:{width:'25%'}}><img src="history.png" alt="betting history" className="link-image"/>{xtraWide?'History':<></>}</Link>
        <Link href="/wallet" style={meta.commish?{width:'12.5%'}:{width:'25%'}}><img src ='balance.png' alt="balance and wallet" className="link-image"/>{xtraWide?'Balance':<></>}</Link>
        <Link href="/social" style={meta.commish?{width:'12.5%'}:{width:'25%'}}><img src="social.png" alt="social" className="link-image"/>{xtraWide?'Groups':<></>}</Link>
        {
        meta.commish?
        (
        <>
          <Link href="/new-group" style={meta.commish?{width:'12.5%'}:{width:'25%'}}><img src="creategroup.png" alt="create group" className="link-image"/>{xtraWide?'New Group':<></>}</Link>
          <Link href="/your-groups" style={meta.commish?{width:'12.5%'}:{width:'25%'}}><img src="groupsettings.png" alt="manage groups" className="link-image"/>{xtraWide?'Group Settings':<></>}</Link>
          <Link href="/new-bet" style={meta.commish?{width:'12.5%'}:{width:'25%'}}><img src="newbet.png" alt="create bet" className="link-image"/>{xtraWide?'New Bet':<></>}</Link>
          <Link href="/bookkeeping" style={meta.commish?{width:'12.5%'}:{width:'25%'}}><img src="bookkeeping.png" alt="bookkeeping and bet manager" className="link-image"/>{xtraWide?'Bookkeeper':<></>}</Link>       
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
