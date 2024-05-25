import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../functions/SupabaseClient";

export default function MastersPage() {
    return (
        <div className="masters page">
            <PGAPortal />
        </div>
    );
}

function PGAPortal() {
    const [tournaments, setTournaments] = useState(undefined);

    useEffect(() => {
        const getTournaments = async () => {
            const { data, error } = await supabase.from("tournaments").select().order("cut_time", {
                ascending: false,
            });
            if (!error && data.length) {
                setTournaments(data);
            }
        };
        getTournaments();
    }, []);

    return (
        <div className="tournament-link-list">
            {tournaments?.map((tournament, index) => {
                return <TournamentLink tournament={tournament} key={index} />;
            })}
        </div>
    );
}

function TournamentLink({ tournament }) {
    const [img, setImg] = useState(<></>);

    useEffect(() => {
        switch (tournament.tournament_name) {
            case "2024 Masters":
                setImg(<img className="golf-preview augusta" src="/augustanational.png" style={{ objectFit: "cover", position: "absolute", zIndex: 0 }} />);
                break;
            case "2023 Masters":
                setImg(<img className="golf-preview augusta" src="/augustanational.png" style={{ objectFit: "cover", position: "absolute", zIndex: 0 }} />);
                break;
            case "2024 PGA Championship":
                setImg(<img className="golf-preview valhalla" src="/valhallagolfclub.png" style={{ objectFit: "cover", position: "absolute", zIndex: 0, transform: "translateY(160px)" }} />);
                break;
            case "2024 US Open":
                setImg(<img className="golf-preview pinehurst" src="/pinehurst.jpg" style={{ objectFit: "cover", position: "absolute", zIndex: 0, transform: "translateY(-375px)" }} />);
                break;
        }
    }, []);

    return (
        <Link className="tournament-link" href={"/pga/" + tournament.extension}>
            {img ? img : <></>}
            <span className="link">{tournament.tournament_name}</span>
            <div className="arrow-protector">
                <img src="arrow.png" style={{ width: "40px", height: "26px", transform: "rotate(-90deg)" }} />
            </div>
        </Link>
    );
}
