import UserBets from "../components/UserBets";
import ProtectedRoute from "./_ProtectedRoute";

export default function UserBetsPage() {
    return (
        <ProtectedRoute>
            <UserBets />      
        </ProtectedRoute>
    );
}