import Loading from "./Loading";
import { mode, validate } from "../functions/Bet2Ops";

export default function Bet({bet, key}) {
    if (!bet) {
        return <Loading />
    }
    if (!validate(bet)) {
        return <></>;
    }

    const m = mode(bet);
    if (m === "over_under") {
        return <OU bet={bet}/>;
    } 
    else if (m === "options") {
        return <OP bet={bet} />;
    } else {
        return <></>; //bad bet
    }
}

function OP({bet}) {

}

function OU({bet, options}) {
    return <div className="ver-under bet">
        <div className="title">
            {bet.content}
        </div>
        <div className="options-container">

        </div>
    </div>
}