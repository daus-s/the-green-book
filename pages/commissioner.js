import { useMobile } from "../components/providers/MobileContext";

export default function CommissionerPage() {
    const {isMobile} = useMobile();
    return (
        <div className="commissioner-menu page">
            <div className="groups">
                Groups
                <div className="options">
                    <div className="create-group-selection option">
                        <img src="creategroup.png" style={{width: '100px'}}/>
                        Create Group
                    </div>
                    <div className="manage-group-selection option">
                        <img src="groupsettings.png" style={{width: '100px'}}/>
                        Manage Groups
                    </div>
                </div>
            </div>
            <div className="bets">
                Bets
                <div className="options">
                    <div className="create-bet-selection option">
                        <img src="newbet.png" style={{width: '100px'}}/>
                        Create Bet
                    </div>
                    <div className="manage-bet-selection option">
                        <img src="bookkeeping.png" style={{width: '100px'}}/>
                        Bookkeeper
                    </div>
                </div>
            </div>

        </div>
    );
}