import Social from "../components/Social";
import ProtectedRoute from "./_ProtectedRoute";

export default function SocialPage() {
    return (
        <ProtectedRoute>
                <Social />
        </ProtectedRoute>
    );
}