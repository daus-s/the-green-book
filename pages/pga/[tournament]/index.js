import { useEffect, useState } from "react";
import TournamentDashboard from "../../../components/TournamentDashboard";
import { useRouter } from 'next/router'
import { supabase } from "../../../functions/SupabaseClient";


export default function Tournament({}) {
    const [tournament, setTournament] = useState(undefined);

    const router = useRouter();

    useEffect(()=>{
        const getTournament = async () => {
            console.log(router.query)
            if (router.query&&router.query.tournament) {
                const {data, error} = await supabase.from('tournaments').select().eq('extension', router.query.tournament).single(); //protected by unique condition on extension 
                // console.log(router.query.tournament);
                if (!error&&data) {
                    setTournament(data);
                } 
            }
        }


        // console.log('router-query:', router)
        // console.log('permission to do some fucky shit rn?');
        if (router&&router.query?.tournament) {
            // console.log('* * * GRANTED * * *');
            getTournament();
        }
    }, [router])

    return (
        <div className="tournament-dashboard page">
            <TournamentDashboard tournament={tournament}/>
        </div>
    );
}