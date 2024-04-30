import { useState } from "react";
import { useMobile } from "./providers/MobileContext";
import BalanceTable from "./BalanceTable";
import Commishify from "./Commishify";
import PGACreator from "./PGACreator";
import AdminComponent from "./AdminComponent";

export default function Admin() {
    const {isMobile} = useMobile();

    const adminComponents = [<BalanceTable />, <Commishify />, <PGACreator />];
    const [comp, setComp] = useState(0);

    
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