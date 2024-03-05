import GroupManager from "../components/GroupManager";
import Header from "../components/Header";
import ProtectedRoute from "./_ProtectedRoute";

export default function ManageGroupPage() {
    return (
        <ProtectedRoute>
            <div className="App">
                <Header />
                <GroupManager />
            </div>
        </ProtectedRoute>
    );
}