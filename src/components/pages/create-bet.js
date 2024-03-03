import CreateBet from "../CreateBet";
import Header from "../Header";

import { Navigate } from 'react-router-dom';
import { isLoggedIn } from "../../functions/LoginBool";

export default function CreateBetPage() {
    return (
        <div className="App">
            <Header />
            {isLoggedIn()?<CreateBet />:<Navigate to="/login"/>}
        </div>
    )
}