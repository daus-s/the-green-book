import Wallet from "../components/Wallet";
import Header from "../components/Header";
import ProtectedRoute from "./_ProtectedRoute";
import { useMobile } from "../components/providers/MobileContext";
import MobileFooter from "../components/MobileFooter";


export default function WalletPage() {
    const { isMobile } = useMobile();
    return (
        <ProtectedRoute>
            <div className="App">   
                <Header/>
                <Wallet />
                {isMobile?<MobileFooter />:<></>}
            </div>
        </ProtectedRoute>
    );
    
}