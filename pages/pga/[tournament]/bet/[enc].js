import MastersPlaceBetForm from "../../../../components/MastersBetPlaceForm";
import { usePlayer } from "../../../../components/providers/PlayerContext";

export default function MasterBet() {
    //copypasta half the code from MastersPlaceBetForm.js
    //preload the data
    const { tour } = usePlayer();

    return (
        <div className="golf-bet page">
            <a className="return" href={"/pga/" + tour?.extension} style={{ height: "18px" }}>
                {"<"} Return to tournament dashboard
            </a>
            <MastersPlaceBetForm />
        </div>
    );
}
