import { Navigate } from 'react-router-dom';
import { isLoggedIn } from "../../functions/LoginBool";
import CreateBet from "../components/CreateBet";
import Header from "../components/Header";

export default function CreateBetPage() {
    return (
        <div className="App">
            <Header />
            {isLoggedIn()?<CreateBet />:<Navigate to="/login"/>}
        </div>
    )
}