import BetManager from "../BetManager";
import Header from "../Header";

import { Navigate } from 'react-router-dom';
import { isLoggedIn } from "../../functions/LoginBool";

export default function BetManagerPage() {
    return (
        <div className="App">
            <Header/>
            {isLoggedIn()?<BetManager />:<Navigate to="/login"/>}
        </div>
    )
}