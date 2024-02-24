import Header from "../Header";
import UserBets from "../UserBets";

import { Navigate } from 'react-router-dom';
import { isLoggedIn } from "../../functions/LoginBool";

export default function UserBetsPage() {
    return (
        <div className="App">
            <Header />
            {isLoggedIn()?<UserBets />:<Navigate to="/login"/>}        
        </div>
    );
}