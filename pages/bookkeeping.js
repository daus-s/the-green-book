import BetManager from "../components/BetManager";
import ProtectedRoute from "./_ProtectedRoute";

export default function BetManagerPage() {
    return (
        <ProtectedRoute>
                <BetManager />
        </ProtectedRoute>
    )
}