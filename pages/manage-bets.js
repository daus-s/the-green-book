import BetManager from "../components/BetManager";
import Header from "../components/Header";
import ProtectedRoute from "./_ProtectedRoute";

export default function BetManagerPage() {
    return (
        <ProtectedRoute>
            <div className="App">
                <Header/>
                <BetManager />
            </div>
        </ProtectedRoute>
    )
}