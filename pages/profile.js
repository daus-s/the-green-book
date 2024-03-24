import Profile from "../components/Profile";
import ProtectedRoute from "./_ProtectedRoute";


export default function ProfilePage() {
    return (
        <ProtectedRoute>
                <Profile />
        </ProtectedRoute>
    );
}