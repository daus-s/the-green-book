import { useEffect } from "react"
import { supabase } from "../functions/SupabaseClient"

function Commission() {
    const makeReq = async () => {
        const { error } = await supabase.from('').insert()
    }

    useEffect(()=>{

    }, [])

    return <div className="commission page">
        <h1>Become a commissioner</h1>
        <ul>
            <li>Create Groups with Friends</li>
            <li>Create, place and cash bets</li>
            <li>Place bets in <u><b>collective</b></u> groups</li>
        </ul>
        <button className="commishify" onClick={makeReq}>Join Now</button>
    </div>
}

export default function CommissionPage() {
    return <Commission />
}

