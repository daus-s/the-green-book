import Header from "../components/Header";
import UserBets from "../components/UserBets";
import ProtectedRoute from "./_ProtectedRoute";

export default function UserBetsPage() {
    return (
        <ProtectedRoute>
            <div className="App">
                <Header />
                <UserBets />      
            </div>
        </ProtectedRoute>
    );
}