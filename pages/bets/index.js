//potential fix
import Bets from "../../components/Bets";
import Header from "../../components/Header";
import ProtectedRoute from "../_ProtectedRoute";
import { useMobile } from "../../components/providers/MobileContext";
import MobileFooter from "../../components/Sidebar";

export default function BetPage() {
    const { isMobile } = useMobile();

    return (
        <ProtectedRoute>
            <div className="App">
                <Bets />
            </div>
        </ProtectedRoute>
    );
}
