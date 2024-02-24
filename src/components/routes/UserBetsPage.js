import Header from "../Header";
import UserBets from "../UserBets";

import { Navigate } from 'react-router-dom';

export default function UserBetsPage() {
    return (
        <div className="App">
            <Header />
            {sessionStorage.getItem("logged-in")?<UserBets />:<Navigate to="/login"/>}        
        </div>
    );
}