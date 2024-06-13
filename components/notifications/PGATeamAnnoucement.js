import { golferViaIndex } from "../../functions/GolfFunctions";
import { partition } from "../../functions/RandomBigInt";
import { useTournament } from "../providers/TournamentContext";

const { default: Link } = require("next/link");
const { useEffect, useState } = require("react");

const id2tour = {
    2: { id: 7, table: "masters_opponent" },
    3: { id: 7, table: "masters_league" },
};

export default function PGATeamAnnouncement({ notification, locallyViewed, setLocallyViewed }) {
    const [tournament, setTournament] = useState(undefined);

    const { golfers } = useTournament();

    const team = partition(notification.value);

    const getTournament = async () => {
        const { data, error } = await supabasese.from("tournaments").select().eq("id", id2tour[notification.code]).single();
        if (!error && data) {
            setTournament();
        }
    };

    useEffect(() => {
        getTournament();
    }, []);

    return (
        <div className={"notification" + (notification.viewed || locallyViewed ? "" : "new")} onMouseEnter={() => setLocallyViewed(true)}>
            Your team for the {id2tour[notif]} is {golferViaIndex(team[0], golfers)}, {golferViaIndex(team[1], golfers)}, {golferViaIndex(team[2], golfers)}, {golferViaIndex(team[3], golfers)}.
            <Link href={`/pga/${tournament.extension}/`}>View bet</Link>
            <Image src="/arrow.png" width={32} height={32} style={{ transform: "rotate(90deg)" }} />
        </div>
    );
}

// //    const link = "/pga/%s/%s";
// if (notification.dst) {
//     //1v1 bet
//     link.concat("@");
//     link.concat();
// } else if (notification.dst === null) {
//     link.concat("$");
// }
