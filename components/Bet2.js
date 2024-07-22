import Loading from "./Loading";
import { sfo, asFunctionOfShare, mode, percentForOpt, validate } from "../functions/Bet2Ops";
import Ackerman from "./Ackerman";
import { useState } from "react";

export default function Bet({ bet, key }) {
    if (!bet) {
        return <Loading />;
    }
    if (!validate(bet)) {
        return <></>;
    }

    const m = mode(bet);
    if (m === "over_under") {
        return <OU bet={bet} />;
    } else if (m === "options") {
        return <OP bet={bet} />;
    } else {
        return <></>; //bad bet
    }
}

function OP({ bet }) {}

function OU({ bet }) {
    const options = bet.options;
    const wagers = bet.wagers;

    const kvp = sfo(options, wagers);
    return (
        <div className="over-under bet">
            <div className="title">{bet.content}</div>
            <div className="options-container">
                {Array.isArray(kvp)
                    ? kvp
                          .sort((a, b) => {
                              return b.sum - a.sum;
                          })
                          .map((kvp, index) => {
                              return <Option option={kvp.option} wagers={wagers} sum={kvp.sum} key={index} />;
                          })
                    : () => {}}
            </div>
        </div>
    );
}

function Option({ option, wagers, sum }) {
    const percent = percentForOpt(option.oid, wagers); //we need to make a decision of how to handle this result here...
    // console.log(option.oid, wagers);

    const [hover, setHover] = useState(false);

    return (
        <div className="option client">
            <Ackerman percent={percent} />
            <div className="info">
                <div className="title">{option.content}</div>
                <div className="stat" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    {!hover ? asFunctionOfShare(percent) : "" + sum + " tkns"}
                </div>
            </div>
        </div>
    );
}
