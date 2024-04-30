import { useEffect, useState } from "react";
import { useMobile } from "./providers/MobileContext";
import { useAuth } from "./providers/AuthContext";
import BalanceTable from "./BalanceTable";
import Commishify from "./Commishify";
import PGACreator from "./PGACreator";
import AdminComponent from "./AdminComponent";

export default function Admin() {
    const {isMobile} = useMobile();
    const {user, meta, admin} = useAuth();
    const [access, setAccess] = useState(false);

    const adminComponents = [<BalanceTable />, <Commishify />];
    const [comp, setComp] = useState(0);


    useEffect(()=>{
        const isAdmin = async () => {
            const a = await admin();
            //a is bool
            setAccess(a);
        }
        isAdmin();
    },[user, meta])

    
    if (isMobile) {
        return (
            <div className="admin page" style={{width: '100%', paddingBottom: '114px', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'space-between'}}>
                {adminComponents[comp]}
                <div className="dot-selector">
                    {adminComponents.map((c, index)=>{
                        return <button value={index} onClick={(e)=>setComp(e.target.value)} style={index==comp?{boxShadow: '0 0 10px white',}:{}}></button>
                    })}
                </div>
            </div>
        );
    } 
    else {
        return (
            <div className="admin page" style={{height: 'auto'}}>
                <AdminComponent classname={'user-bals'} title={"User balances"}>
                    <BalanceTable />
                </AdminComponent> 
                <AdminComponent classname={'commishify'}>
                    <Commishify /> 
                </AdminComponent> 
                <AdminComponent title="Create PGA tournament" classname={'pga-tool'}>
                    <PGACreator />
                </AdminComponent>
            </div>
            );
    }
}