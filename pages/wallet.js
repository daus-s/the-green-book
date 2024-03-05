import Wallet from "../components/Wallet";
import Header from "../components/Header";
import ProtectedRoute from "./_ProtectedRoute";


export default function WalletPage() {
    return (
        <ProtectedRoute>
            <div className="App">   
                <Header/>
                <Wallet />
            </div>
        </ProtectedRoute>
    );
    
}