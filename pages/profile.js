import Header from "../components/Header";
import Profile from "../components/Profile";
import ProtectedRoute from "./_ProtectedRoute";


export default function ProfilePage() {
    return (
        <ProtectedRoute>
            <div>
                <Header />
                <Profile />
            </div>
        </ProtectedRoute>
    );
}