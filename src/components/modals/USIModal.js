 /* User Search and Insert */
//THIS MAY CRASH BROWSER IDK HOW MUCH MEMORY IT WILL TAKE
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

import { supabase } from "../../functions/SupabaseClient";

import "../../styles/modals.css";
import { useModal } from '../providers/ModalContext';


const USIModal = ({ isOpen, onCancel, onConfirm}) => {

    const { succeed, failed } = useModal();

    const [query, setQuery] =  useState("");
    const [user, setUser] = useState({});

    const [src, setSrc] = useState("user.png");

    const [pretendCache, setPretendCache] = useState({});
    const [results, setResults] = useState([]);

    const handleClick = () => {
        onConfirm(user&&user.id&&user.id)
    }

    const handleSubmit = (e) => {
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
        onRequestClose={onCancel}
        style={{
          overlay: {
            backgroundColor: 'var(--overlay)',
            zIndex: 1000, // Adjust the value based on your layout
          },
          content: {
            backgroundColor: 'var(--bet-background-color)',
            width: '768px',
            height: '400px',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          },
        }}
      >
        <div className="modal usi" >
            <form className='user' onSubmit={handleSubmit}>
                <div className='pfp'>
                    <img src={src} style={{height: '64px', borderRadius:'50%'}}/>
                </div>
                <div className='name'>
                    {user&&user.username?user.username:''}
                </div>
                <button className='add' onClick={handleClick}>
                    <img src="insert.png" style={{height: '48px', padding: '8px'}}/>
                </button>
            </form>
            <div className='search-container'>
                <input className="search-bar" placeholder="search users..." value={query} onChange={(e)=>setQuery(e.target.value)}/><img style={{height: '32px'}} src="search.png"/>
            </div>
            <div class="scroll-container">
                <div class="content">
                    {/* {JSON.stringify(results)} */}
                    {query&&results&&results.map((r, index)=>{
                        return <SearchResult r={r} key={index} select={setUser}/>;
                    })}
                </div>
            </div>
        </div>
      </Modal>
    );
};



const SearchResult = ({r, select}) => {
    return (
        <div className='result' onClick={()=>select(r)}>
            <div className='result-pfp'>
                <img src={r.pfp_url} style={{height: '60px', borderRadius:'50%'}}/>
            </div>
            <div className='text-fields'>            
                <div className='username'>{r.username}</div>
                <div className='email'>{r.email}</div>
            </div>
        </div>
    )
}
  
export default USIModal;