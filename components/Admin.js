import { useEffect, useState } from "react";
import { useMobile } from "./providers/MobileContext";
import { useAuth } from "./providers/AuthContext";
import BalanceTable from "./BalanceTable";
import Commishify from "./Commishify";

export default function Admin() {
    const {isMobile} = useMobile();
    const {user, meta, admin} = useAuth();
    const [access, setAccess] = useState(false);

    const adminComponents = [<BalanceTable />, <Commishify />];
    const [comp, setComp] = useState(0);


    useEffect(()=>{
        const isAdmin = async () => {
            const a = await admin();
            console.log(a);
            //a is bool
            setAccess(a);
        }
        isAdmin();
    },[user, meta])


    if (!isMobile) {
        return (
            <div className="admin page">
                <BalanceTable /> 
                <Commishify /> 
            </div>
        );
    } 
    else if (isMobile) {
        return (
            <div className="admin page">
                {adminComponents[comp]}
                <div className="dot-selector">
                    {adminComponents.map((c, index)=>{
                        <button value={index} onClick={(e)=>setComp(e.target.value)} style={index===comp?{boxShadow:'0 0 5px white'}:{}}>&middot;</button>
                    })}
                </div>
            </div>
        );
    }
}