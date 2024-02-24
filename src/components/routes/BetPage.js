//potential fix
import { Navigate } from 'react-router-dom';

import Bets from "../Bets";
import Header from "../Header";

export default function BetPage() {

    //dubuG
    //normaly goes to <Navigate to="/login"/>

    return (
        <div className="App">
            <Header/>
            {sessionStorage.getItem("logged-in")?<Bets />:<Navigate to="/login"/>}
        </div>
    )
}