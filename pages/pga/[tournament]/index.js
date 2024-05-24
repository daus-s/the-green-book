import TournamentDashboard from "../../../components/TournamentDashboard";
import { useTournament } from "../../../components/providers/TournamentContext";

export default function Tournament() {
    const { tournament } = useTournament();

    return (
        <div className="tournament-dashboard page">
            <TournamentDashboard tournament={tournament}/>
        </div>
    );
}