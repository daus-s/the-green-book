import { useEffect, useState } from "react"
import { supabase } from "../functions/SupabaseClient";

export default function UserElement({ public_uid }) {
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const getUser = async () => {
            const { data, error } = await supabase.from('public_users').select().eq("id", public_uid);
            console.log(data?data:error)
            if (data&&data.length==1) {
                setUser(data[0])
            } else if  (error) {
                
            } else {

            }
        }

        getUser();
    }, []);

    return (<div className="user-element"><img src={user?user.pfp_url:"/user.png"}/>{user?user.username:<span className="grayed-out">User</span>}<button><img src="remove.png"/></button></div>)
}