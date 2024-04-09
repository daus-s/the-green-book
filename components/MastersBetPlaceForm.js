import { useEffect, useState } from "react";
import { getGolfers } from "../functions/GetGolfers";
import Loading from "./Loading";

export default function MastersPlaceBetForm({}) {
    const [golfers, setGolfers] = useState([]);
    const [p1, setP1] = useState(null);
    const [p2, setP2] = useState(null);
    const [p3, setP3] = useState(null);
    const [p4, setP4] = useState(null);
    const [alt1, setAlt1] = useState(null);
    const [alt2, setAlt2] = useState(null);
    const [alt3, setAlt3] = useState(null);
    const [alt4, setAlt4] = useState(null);

    const getPlayers = async () => {
        const {data, error}  = await getGolfers();
        data?setGolfers(data):null;
    }
    
    useEffect(()=> {
        getPlayers();   
    }, [])

    return (
        <div className="masters-place-bet-form">
            <div className="golfers">
                {golfers ? (
                    <ul>
                        {golfers.map(golfer => (
                            <li key={golfer.id}>{golfer.name}</li>
                        ))}
                    </ul>
                ) : (
                    <Loading />
                )}
            </div>
            <div className="player-selector one">{p1?(1):(2)}</div>
            <div className="player-selector two">{p2?(1):(2)}</div>
            <div className="player-selector thr">{p3?(1):(2)}</div>
            <div className="player-selector for">{p4?(1):(2)}</div>
            <div className="player-selector alt-one">{alt1?(1):(2)}</div>
            <div className="player-selector alt-two">{alt2?(1):(2)}</div>
            <div className="player-selector alt-thr">{alt3?(1):(2)}</div>
            <div className="player-selector alt-for">{alt4?(1):(2)}</div>
            <div className="projection">Do some basic analytics here</div>
            <div className="playing who">
                Who r u playing
            </div>
        </div>
    );
}