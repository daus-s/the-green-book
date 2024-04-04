import { useEffect, useState } from "react"
import { supabase } from "../functions/SupabaseClient"
import { useAuth } from "../components/providers/AuthContext"
import { useMobile } from "../components/providers/MobileContext";
import ProtectedRoute from "./_ProtectedRoute";


function Commission() {
    const [requested, setRequested] = useState(false);
    
    const {isMobile} = useMobile();
    const {user, meta} = useAuth();

    const makeReq = async () => {
        const { error } = await supabase.from('commissioning').insert({id: user.id});
        if (!error) {
            setRequested(true);
        }
    }

    useEffect(()=>{
        const checkRequest = async () => {
            if (user) {
            const {data, error} = await supabase.from('commissioning').select().eq('id', user.id);
            if (!error) {
                if (data.length) {
                    setRequested(true);
                }
            }
            //otherwise something failed to load
            }
        }

        checkRequest();
    }, [user, meta])

    return <div className="commission page" style={isMobile?{paddingBottom: '114px', borderRadius: '0px'}:{}}>
        <h1>Become a commissioner</h1>
        <ul>
            <li><img src="social.png" /></li>
            <li style={{margin: '0px 0px 10px 0px'}}>Create Groups with Friends</li>
            <li><img src="bookkeeping.png" /></li>
            <li style={{margin: '0px 0px 10px 0px'}}>Create, place and cash bets</li>
            <li><img src="bet.png" /></li>
            <li style={{margin: '0px 0px 10px 0px'}}>Place bets in <u><b>collective</b></u> groups</li>
        </ul>
        {meta.commish?<div className="commishify already-a-commish" onClick={()=>{window.location.href="/commissioner"}}><div className="img-cntr"><img src='shield.png' style={{height: '80px'}}></img></div>Already commissioned.</div>:requested?<button className="commishify deactive" disabled>Requested</button>:<button className="commishify" onClick={makeReq}>Join Now</button>}
    </div>
}

export default function CommissionPage() {
    return (
        <ProtectedRoute>
            <Commission />
        </ProtectedRoute>
    );
}

