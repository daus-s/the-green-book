//potential fix
import Bets from "../components/Bets";
import Header from "../components/Header";
import ProtectedRoute from "./_ProtectedRoute";

export default function BetPage() {

    return (
        <ProtectedRoute>
            <div className="App">
                <Header/>
                <Bets />
            </div>
        </ProtectedRoute>
    )
}