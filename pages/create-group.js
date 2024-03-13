import CreateGroup from "../components/CreateGroup";
import ProtectedRoute from './_ProtectedRoute';

export default function NewGroupPage() {
    return (
        <ProtectedRoute>
            <CreateGroup />
        </ProtectedRoute>
    );
}