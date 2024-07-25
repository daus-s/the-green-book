import Loading from "./Loading";
import { sfo, asFunctionOfShare, mode, percentForOpt, validate, tokenSum } from "../functions/Bet2Ops";
import Ackerman from "./Ackerman";
import { useState } from "react";
import { useAuth } from "./providers/AuthContext";

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
        console.warn("bad bet error");
        return <></>; //bad bet
    }
}

function OP({ bet }) {
    const options = bet.options;
    const wagers = bet.wagers;
    const { meta } = useAuth();

    const kvps = sfo(options, wagers, meta);
    console.log(kvps);
    return (
        <div className="over-under bet">
            <div className="title">{bet.content}</div>
            <div className="options-container">
                {Array.isArray(kvps)
                    ? kvps
                          .sort((a, b) => {
                              return b.sum - a.sum;
                          })
                          .map((kvp, index) => {
                              return <Option option={kvp.option} wagers={wagers} sum={kvp.sum} pick={kvp.pick} key={index} />;
                          })
                    : () => {}}
            </div>
        </div>
    );
}

function OU({ bet }) {
    const options = bet.options;
    const wagers = bet.wagers;
    const { meta } = useAuth();

    const kvps = sfo(options, wagers, meta);
    return (
        <div className="over-under bet">
            <div className="title">{bet.content}</div>
            <div className="options-container">
                {Array.isArray(kvps)
                    ? kvps
                          .sort((a, b) => {
                              return b.sum - a.sum;
                          })
                          .map((kvp, index) => {
                              return <Option option={kvp.option} wagers={wagers} sum={kvp.sum} pick={kvp.pick} key={index} line={bet.line} />;
                          })
                    : () => {}}
            </div>
        </div>
    );
}

function Option({ option, wagers, sum, pick, line }) {
    const linestr = String(line ? line : "");
    let percent = percentForOpt(option.oid, wagers); //we need to make a decision of how to handle this result here...
    if (isNaN(percent)) {
        percent = 0;
    }
    // console.log(option.oid, wagers);

    const [hover, setHover] = useState(false);

    let oppColor;

    const status = pick === undefined ? "" : pick === option.oid ? "selected" : "not-selected";
    if (status === "selected") {
        oppColor = "var(--your-pick)"; //filled color
    } else if (status === "not-selected") {
        oppColor = "var(--not-your-pick)";
    } else {
        oppColor = "var(--bet-option-highlight)";
    }

    const imps = asFunctionOfShare(percent);
    const tkns = tokenSum(sum);
    return (
        <div className={"option client " + status}>
            <Ackerman percent={percent} oColor={oppColor} />
            <div className="info">
                <div className="title">{option.content + " " + linestr}</div>
                <div className="stat" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                    {hover ? imps : tkns}
                </div>
            </div>
        </div>
    );
}
