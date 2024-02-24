import Header from "../Header";
import Wallet from "../Wallet";

import { Navigate } from 'react-router-dom';

export default function WalletPage() {
    return (
    <div className="App">
        <Header />
        {sessionStorage.getItem("logged-in")?<Wallet />:<Navigate to="/login"/>}        
    </div>);
}