import Header from "../Header";
import Wallet from "../Wallet";

import { Navigate } from 'react-router-dom';
import { isLoggedIn } from "../../functions/LoginBool";

export default function WalletPage() {
    return (
    <div className="App">
        <Header />
        {isLoggedIn()?<Wallet />:<Navigate to="/login"/>}        
    </div>);
}