import { useEffect, useState } from "react";
import { useMobile } from "./providers/MobileContext";
import { useAuth } from "./providers/AuthContext";
import BalanceTable from "./BalanceTable";
import Commishify from "./Commishify";

export default function Admin() {
    const {isMobile} = useMobile();
    const {user, meta, admin} = useAuth();
    const [access, setAccess] = useState(false);

    useEffect(()=>{
        const isAdmin = async () => {
            const a = await admin();
            console.log(a);
            //a is bool
            setAccess(a);
        }
        isAdmin();
    },[user, meta])
    return (
        <div className="admin page">
            <BalanceTable /> 
            <Commishify /> 
        </div>
    );
}