import CreateBet from "../components/CreateBet";
import Header from "../components/Header";
import ProtectedRoute from './_ProtectedRoute';

export default function CreateBetPage() {
    return (
        <ProtectedRoute>
            <div className="App">
                <Header />
                <CreateBet />
            </div>
        </ProtectedRoute>
    )
}