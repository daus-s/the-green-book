 /* User Search and Insert */
//THIS MAY CRASH BROWSER IDK HOW MUCH MEMORY IT WILL TAKE
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { supabase } from "../../functions/SupabaseClient";
import { useModal } from '../providers/ModalContext';
import { useMobile } from '../providers/MobileContext';
import UserSearchResult from '../UserSearchResult';

const USIModal = ({ isOpen, onCancel, onConfirm}) => {
    const { failed } = useModal();
    const {isMobile} = useMobile();

    const [query, setQuery] =  useState("");
    const [user, setUser] = useState({});

    const [src, setSrc] = useState("user.png");

    const [pretendCache, setPretendCache] = useState({});
    const [results, setResults] = useState([]);

    const cancelWrapper = () => {
        setQuery('');
        setUser({});
        //dont clear pretend cache
        setResults('');
        onCancel();
    }

    const handleClick = () => {
        onConfirm(user&&user.id);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleClick();
    }
    //we search for users using this modal using the LIKE operator in plpgsql
    useEffect(() => {
        const doQuery = async () => { //dynamic programming?
            // if (query.length > 1) { //ONLY IF SCALNG ISSUES
            if (!pretendCache[query]) {
                const { data, error } = await supabase.from('public_users').select().ilike('username',  `${query}%`).order('username');
                if (data) {
                    let s  = {...pretendCache};
                    s[query] = data;
                    if (s.length > 32) {
                        s.shift();
                    }
                    setPretendCache(s);
                    setResults(data);   
                } 
                else if (error) {
                    failed(error.message);
                } 
            }
            else {
                setResults(pretendCache[query]);
            }
            // } // ONLY IF SCALING ISSUES : other wise not long enough to query meaningfully
        }
        doQuery();

    },[query]);

    useEffect(()=>{
        setSrc(user.pfp_url);
    }, [user])

    return (
      <Modal 
        isOpen={isOpen} 
        onRequestClose={cancelWrapper}
        style={{
          overlay: {
            backgroundColor: 'var(--overlay)',
            zIndex: 1000, // Adjust the value based on your layout
          },
          content: {
            backgroundColor: 'var(--bet-background-color)',
            width: isMobile?'calc(100% - 20px)':'768px',
            height: '400px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'visible',
          },
        }}
        portalClassName='normal-overflow'
      >
        <div className="modal usi" >
            <form className='user' onSubmit={handleSubmit} style={isMobile?mobileStyle.child:{}}>
                <div className='pfp' style={isMobile?{marginRight: 0, height: '48px'}:{}}>
                    <img src={src} style={{height: isMobile?'48px':'64px', borderRadius:'50%'}}/>
                </div>
                <div className='name' style={isMobile?{width: 'calc(100% - 96px)', height: '48px'}:{}}>
                    {user&&user.username?user.username:''}
                </div>
                <button className='add' onClick={handleClick}>
                    <img src="/insert.png" style={{height: '48px', padding: '8px'}}/>
                </button>
            </form>
            <div className='search-container' style={isMobile?{...mobileStyle.child, ...mobileStyle.noTransfrom}:{}}>
                <input 
                    className="search-bar" 
                    placeholder="search users..." 
                    value={query} 
                    onChange={(e)=>setQuery(e.target.value)}
                    style={isMobile?mobileStyle.child:{}}
                />
                <img style={{height: isMobile?'20px':'32px'}} src="/search.png"/>
            </div>
            <div className="scroll-container" style={isMobile?mobileStyle.scroll:{}}>
                <div className="content">
                    {/* {JSON.stringify(results)} */}
                    {query&&results&&results.map((r, index)=>{
                        return <UserSearchResult r={r} key={index} select={setUser}/>;
                    })}
                </div>
            </div>
        </div>
      </Modal>
    );
};
  
export default USIModal;

const mobileStyle = {
    child: {
        width: 'calc(100% - 20px)',
        fontSize: '20px'
    },
    noTransfrom: {
        transform: 'translateX(0)'
    },
    scroll: {
        top: '100px',
        maxHeight: '275px',
    },
    result: {
        width: 'calc(100% - 20px)',
    }
}