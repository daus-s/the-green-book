import Header from "../Header";
import UserBets from "../UserBets";

export default function UserBetsPage() {
    return (
        <div className="App">
            <Header />
            {sessionStorage.getItem("logged-in")?<UserBets />:<Navigate to="/login"/>}        
        </div>
    );
}