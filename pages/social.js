import Header from "../components/Header";
import Social from "../components/Social";
import ProtectedRoute from "./_ProtectedRoute";

export default function SocialPage() {
    return (
        <ProtectedRoute>
            <div className="App">
                <Header />
                <Social />
            </div>
        </ProtectedRoute>
    );
}