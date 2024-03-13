import CreateBet from "../components/CreateBet";
import ProtectedRoute from './_ProtectedRoute';

export default function CreateBetPage() {
    return (
        <ProtectedRoute>
            <CreateBet />
        </ProtectedRoute>
    )
}