import Header from "../components/Header";
import MobileFooter from "../components/MobileFooter";
import Profile from "../components/Profile";
import { useMobile } from "../components/providers/MobileContext";
import ProtectedRoute from "./_ProtectedRoute";


export default function ProfilePage() {
    const { isMobile } = useMobile();

    return (
        <ProtectedRoute>
            <div className="App">
                <Header />
                <Profile />
                {isMobile?<MobileFooter />:<></>}
            </div>
        </ProtectedRoute>
    );
}