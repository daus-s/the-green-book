import CreateBet from "../CreateBet";
import Header from "../Header";

import { Navigate } from 'react-router-dom';

export default function CreateBetPage() {
    return (
        <div className="App">
            <Header />
            {sessionStorage.getItem("logged-in")?<CreateBet />:<Navigate to="/login"/>}
        </div>
    )
}