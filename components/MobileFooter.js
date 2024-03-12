import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from './providers/AuthContext';
import CommissionerShield from './CommissionerShield';
import Notification from './Notification';
import { supabase } from '../functions/SupabaseClient';

function SidebarProfile({meta, user}) {
    console.log(user, meta)
    return (
        <div className='sidebar-profile'>
            <div className='pfp-box'>
                <img className='pfp' src={meta.pfp} onClick={()=>window.location.href='/profile'} />
                {meta.commish&&<CommissionerShield style={{height: '30px', pointerEvents: 'none'}}/>}
            </div>
            <div className='username'>{meta.username}</div>
            <div className='email'>{user.email}</div>
        </div>
    );
}

function Sidebar({close}) {
    const [requests, setRequests] = useState(0);
    const sidebarRef = useRef(null);
    const { user, meta, logout } = useAuth();

    useEffect(()=>{
        const getRequests = async () => {
            try {
                let sum = 0;
                const {data: groupIDs, error} = await supabase.from('groups').select('groupID').eq('commissionerID', meta.commish);
                if (error) {
                    throw error;
                }
                const requestsPromises = groupIDs.map(async (id) => {
                    const { data: requests, error } = await supabase.from('requests').select().eq('group_id', id.groupID);
                    if (error) {
                        throw error;
                    }
                    return requests ? requests.length : 0;
                });
                const requestsLengths = await Promise.all(requestsPromises);
                sum = requestsLengths.reduce((acc, length) => acc + length, 0);
                setRequests(sum);
            } catch (error) {
                console.log('failed to fetch requests');
            }
        }

        getRequests();
    },
    []);

    const handleClickInside = (e) => {
        if (sidebarRef.current && sidebarRef.current.contains(e.target)) {            
            return;
        } else {
            close();
        }
    };

    return (
        <div className='sidebar-container' onClick={handleClickInside}>
            <div className='sidebar' ref={sidebarRef}>
                {user&&meta&&<SidebarProfile user={user} meta={meta}/>}
                <div className='bars'>
                    <div className='sidebar-nav'>
                        <div className='user-options'>
                            <div className='user-title'>
                                <Link href="/profile">User</Link>
                            </div>
                            <div className='user-links'>
                                <Link href="/bets">Place Bets</Link>
                                <Link href="/bets-placed">Bet History</Link>
                                <Link href="/wallet">Wallet</Link>
                                <Link href="/social">Social</Link>
                            </div>
                        </div>
                        {meta.commish && (
                        <div className='commish-options'>
                            <div className='commish-title'>
                                <Link href="/commissioner">Commissioners</Link>
                            </div>
                            <div className='commish-links'>
                                <Link href="/create-bet">Create Bet</Link>
                                <Link href="/manage-bets">Bet Manager</Link>
                                <Link href="/create-group">Create Group</Link>
                                <div className='notification-box' style={{textAlign: 'left'}}>
                                    <Link href="/your-groups" style={{paddingLeft: '0'}}>Group Manager</Link>
                                    <Notification count={requests} style={{width:'18px', height: '18px', fontSize: '14px', fontWeight: 500, transform: 'translateX(-6px) translateY(-4px)', padding: '0'}}/>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                    {user&&meta&&<button className='signout' onClick={logout}>Sign-out</button>}
                </div>
            </div>
        </div>
    );
}
export default function MobileFooter() {
    const [sidebar, setSidebarVis] = useState(false);

    return (
        <>
            <div className="mobile-menu-button">
                <img src="menu.png" alt="mobile menu" onClick={()=>setSidebarVis(true)}/>
            </div>
            {sidebar && <Sidebar close={()=>setSidebarVis(false)} />}
        </>
    );
}