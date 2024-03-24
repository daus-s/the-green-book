import Wallet from "../components/Wallet";
import ProtectedRoute from "./_ProtectedRoute";


export default function WalletPage() {
    return (
        <ProtectedRoute>
            <Wallet />
        </ProtectedRoute>
    );
    
}