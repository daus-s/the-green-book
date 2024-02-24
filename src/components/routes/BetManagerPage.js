import BetManager from "../BetManager";
import Header from "../Header";

import { Navigate } from 'react-router-dom';

export default function BetManagerPage() {
    return (
        <div className="App">
            <Header/>
            {sessionStorage.getItem("logged-in")?<BetManager />:<Navigate to="/login"/>}
        </div>
    )
}