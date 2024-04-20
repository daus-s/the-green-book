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
    useEffect(()=>{
        if (router&&router.query.enc) {
            console.log(router.query.enc, typeof router.query.enc)
            const user = router.query.enc[0].substring(0,6);
            const opp = router.query.enc[0].substring(6,12);

        }
    }, [router])
    

    return (
        <div className='golf-bet page'>
            <a href='/pga'>{'<'} Return to Masters dashboard</a>
            <p>Bet: {router.query.enc}</p>
        </div>
    );
}
