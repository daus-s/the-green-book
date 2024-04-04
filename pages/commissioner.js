import Link from "next/link";
import ProtectedRoute from "./_ProtectedRoute";


export default function CommissionerPage() {
    return (
        <ProtectedRoute>
            <div className="commissioner-menu page">
                <div className="groups">
                    Groups
                    <div className="options">
                        <Link className="create-group-selection option" href="/new-group">
                            <img src="creategroup.png" style={{width: '100px'}}/>
                            Create Group
                        </Link>
                        <Link className="manage-group-selection option" href="/your-groups">
                            <img src="groupsettings.png" style={{width: '100px'}}/>
                            Manage Groups
                        </Link>
                    </div>
                </div>
                <div className="bets">
                    Bets
                    <div className="options">
                        <Link className="create-bet-selection option" href="/new-bet">
                            <img src="newbet.png" style={{width: '100px'}}/>
                            Create Bet
                        </Link>
                        <Link className="manage-bet-selection option" href="/bookeeping">
                            <img src="bookkeeping.png" style={{width: '100px'}}/>
                            Bookkeeper
                        </Link>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}