import { useEffect, useState } from "react";
import { getGolfers } from "../functions/GetGolfers";
import DataDropDown from "./DataDropDown";
import { allButThese, allButThis } from "../functions/AllButThisJSON";

function ListElement({data, index}) {

}

export default function MastersPlaceBetForm({}) {
    const [golfers, setGolfers] = useState([]);
    const [p1, setP1] = useState(undefined);
    const [p2, setP2] = useState(undefined);
    const [p3, setP3] = useState(undefined);
    const [p4, setP4] = useState(undefined);
    const [alt1, setAlt1] = useState(undefined);
    const [alt2, setAlt2] = useState(undefined);
    const [alt3, setAlt3] = useState(undefined);
    const [alt4, setAlt4] = useState(undefined);

    const getPlayers = async () => {
        const {data, error}  = await getGolfers();
        data?setGolfers(data):null;
    }
    
    useEffect(()=> {
        getPlayers();   
    }, [])

    return (
        <div className="masters-place-bet-form">
            <div className="player-selector one"><DataDropDown list={allButThese(golfers, [p2, p3, p4, alt1, alt2, alt3, alt4])} setIndex={setP1}/></div>
            {/* <div className="player-selector two">{p2?(1):(2)}</div>
            <div className="player-selector thr">{p3?(1):(2)}</div>
            <div className="player-selector for">{p4?(1):(2)}</div>
            <div className="player-selector alt-one">{alt1?(1):(2)}</div>
            <div className="player-selector alt-two">{alt2?(1):(2)}</div>
            <div className="player-selector alt-thr">{alt3?(1):(2)}</div>
            <div className="player-selector alt-for">{alt4?(1):(2)}</div> */}
            <div className="projection">Do some basic analytics here</div>
            <div className="playing who">
                Who r u playing
            </div>
        </div>
    );
}