import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
 
export default function MasterBet() {
    //decode the url
    //the first half is the users ID
    //the second half is the league id or opponent id
    //substring(0,6) and substring(6, 12)

    //copypasta half the code from MastersPlaceBetForm.js
    //preload the data
    const [userID, setUserID] = useState(undefined);
    const [oppID, setOppID] = useState(undefined);
    
    
    const router = useRouter()
    console.log('QUERY: ', router?.query);
    useEffect(()=>{
        if (router&&router.query.enc) {
            console.log(router.query.enc, typeof router.query.enc);
            console.log(router.query)
            /* if (router.query.enc.charAt(0)==='$') {
                //league
            }
            else if (router.query.enc.charAt(0)==='@') {
                //single bet
            } */

        }
    }, [router])
    
    return (
        <div className='golf-bet page'>
            <a href='/pga'>{'<'} Return to Masters dashboard</a>
            <p>Tournament: {router.query.tournament}</p>
            <p>Bet: {router.query.enc}</p>
        </div>
    );
}
