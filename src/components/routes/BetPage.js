import Bets from "../Bets";
import Header from "../Header";

export default function BetPage() {
    return (
        <div className="App">
            <Header/>
            {sessionStorage.getItem("logged-in")?<Bets />:<Navigate to="/login"/>}
        </div>
    )
}