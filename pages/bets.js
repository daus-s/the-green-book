//potential fix
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from "../functions/LoginBool";
import Bets from "../components/Bets";
import Header from "../components/Header";

export default function BetPage() {
    return (
        <div className="App">
            <Header/>
            {isLoggedIn()?<Bets />:<Navigate to="/login"/>}
        </div>
    )
}