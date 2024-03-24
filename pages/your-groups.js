import GroupManager from "../components/GroupManager";
import ProtectedRoute from "./_ProtectedRoute";

export default function ManageGroupPage() {
    return (
        <ProtectedRoute>
            <GroupManager />
        </ProtectedRoute>
    );
}