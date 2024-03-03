import Header from "../components/Header";
import UserBets from "../components/UserBets";

import { Navigate } from 'react-router-dom';
import { isLoggedIn } from "../functions/LoginBool";

export default function UserBetsPage() {
    return (
        <div className="App">
            <Header />
            {isLoggedIn()?<UserBets />:<Navigate to="/login"/>}        
        </div>
    );
}