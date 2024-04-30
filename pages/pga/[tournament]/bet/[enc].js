import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { supabase } from '../../../../functions/SupabaseClient'; //hahah
import { decode } from '../../../../functions/Encode';
 
export default function MasterBet() {
    //decode the url
    //the first half is the users ID
    //the second half is the league id or opponent id
    //substring(0,6) and substring(6, 12)

    //copypasta half the code from MastersPlaceBetForm.js
    //preload the data
    
    
    const router = useRouter()
    console.log('QUERY: ', router?.query);

    const getLeagueBet = async (leagueID) => {
        const {data, error} = await supabase.from('masters_league').select().eq('league_id', decode(leagueID));
        console.log(data?data:error);
    }

    useEffect(()=>{
        if (router&&router.query.enc&&router.query.tournament) {
            console.log('permission to do some fucky shit rn');
            if (router.query.enc?.charAt(0)==='$') {
                //league
                getLeagueBet(router.query.enc.substring(1, router.query.enc.length));    
            }
            else if (router.query.enc?.charAt(0)==='@') {
                //single bet

            }
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
