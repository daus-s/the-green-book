import { figureOutCurrentRound, getTeamProjection, goodness, goodnessStr } from "../functions/GolfFunctions";
import { fontSize, height, margin } from "../functions/VariableLengths";
import { useEffect, useState } from "react";
import { coerce } from "../functions/RandomBigInt";
import { useTournament } from "./providers/TournamentContext";
import { allButThese, allButThis } from "../functions/AllButThisJSON";
import { usePlayer } from "./providers/PlayerContext";
import { useMobile } from "./providers/MobileContext";
import { parseable } from "../functions/ParseSchema";
import { useRouter } from "next/router";
import { supabase } from "../functions/SupabaseClient";
import { useModal } from "./providers/ModalContext";
import { useAuth } from "./providers/AuthContext";

import MastersInfoModal from "./modals/MastersInfoModal";
import UserSearchResult from "./UserSearchResult";
import DataDropDown from "./DataDropDown";
import Opponent from "./Opponent";
import Loading from "./Loading";
import Search from "./Search";
import Timer from "./Timer";

function WagerStatusWidget() {
    const { u, t, ubet, tbet, tour } = usePlayer();

    const status = ubet && tbet ? "ready" : tour?.cut_time < new Date() ? (ubet ? "waiting" : "open") : "closed";
    return (
        <div className="status-widget">
            <div className="users">
                <div className="us-container">
                    <img src={u?.pfp_url} />
                    {ubet ? <img className="status" src="/mark.png" /> : <img className="status" src="/close.png" />}
                    {u?.username}
                </div>
                <div className="versus">VS.</div>
                <div className="us-container">
                    <img src={t?.pfp_url} />
                    {tbet ? <img className="status" src="/mark.png" /> : <img className="status" src="/close.png" />}
                    {t?.username}
                </div>
            </div>
            <div className="readable">
                <div>Status</div>
                <div className={status}>{status}</div>
            </div>
        </div>
    );
}

function TournamentWidget({ tournament }) {
    if (tournament && tournament.tournament_name && tournament.cut_time && tournament.extension) {
        return (
            <div className="tournament-widget">
                <span>{tournament.tournament_name.replace(tournament.mongodb_endpoint.year, "")}</span>
                <span style={{ color: "var(--unimportant-text)" }}>{tournament.mongodb_endpoint.year}</span>
                <Timer cutTime={tournament.cut_time} />
            </div>
        );
    } else {
        throw Error("malformed tournament object");
    }
}

function GolferSelector({ player: p, index, list: l, errM, error, set }) {
    const { width } = useMobile();
    const { golfers } = useTournament();
    //why isnt this stuff applying to it

    //oh my god this might be the dumbest design ive ever made
    const [player, setPlayer] = useState(p);
    const [list, setList] = useState(l);

    useEffect(() => {
        if (p) {
            setPlayer(p);
        }
    }, [p]);

    useEffect(() => {
        if (l) {
            setList(l);
        }
    }, [l]);

    return (
        <div style={{ margin: `0px ${margin(width)}px`, width: "calc(25% - 20px)" }}>
            <PickNo num={index + 1} />
            <div className={"player-selector one " + (error && !p1 ? "error-wrapper" : "")}>
                <DataDropDown data={player} list={allButThese(golfers, allButThis(list, player))} set={set} JSX={Golfer} />
            </div>
            {error && !player ? <div className="error-message">{errM}</div> : <></>}
        </div>
    );
}

function Group({ data: group, onClick, display, direction, selected }) {
    if (group) {
        return (
            <div className="group league" onClick={onClick} style={selected ? { backgroundColor: "var(--form-input)" } : {}}>
                {group.groupName}
                {display ? <img className={"dda " + direction} src="/arrow.png" /> : <></>}
            </div>
        );
    } else {
        return (
            <div className="placeholder-div league" style={{ height: "56px" }} onClick={onClick}>
                {display ? <img className={"dda " + direction} src="/arrow.png" /> : <></>}
            </div>
        );
    }
}

function PickNo({ num }) {
    return (
        <div className="number">
            <span style={{ fontSize: "24px" }}>{num > 4 ? "Alt. " : ""}</span>
            <span style={{ fontSize: "24px" }}>#</span>
            <span style={{ fontSize: "42px", color: "var(--bright-text)" }}>{((num - 1) % 4) + 1}</span>
        </div>
    );
}

function StaticGolfer({ data }) {
    const roundNo = data ? figureOutCurrentRound(data) : 0;
    const curr = data?.round;
    let bgs = [{}, {}, {}, {}];
    for (let i = 0; i <= roundNo; ++i) {
        if (i == roundNo) {
            bgs[i] = goodness(curr);
        } else {
            bgs[i] = goodness(data[`rd${i + 1}`] - 72);
        }
    }

    return (
        <div className="golfer display">
            <div className="golfer-name">{data?.name}</div>
            <div className="strokes">
                <div className="stat" style={bgs[0]}>
                    <div className="box-score">{data?.rd1}</div>
                </div>
                <div className="stat" style={bgs[1]}>
                    <div className="box-score">{data?.rd2}</div>
                </div>
                <div className="stat" style={bgs[2]}>
                    <div className="box-score">{data?.rd3}</div>
                </div>
                <div className="stat" style={bgs[3]}>
                    <div className="box-score">{data?.rd4}</div>
                </div>
                Strokes
                <div className="stat" style={goodness(data?.strokes / 4 - 72)}>
                    <div className="box-score wide">{data?.strokes}</div>
                </div>
                Score
                <div className="stat" style={goodness(data?.total)}>
                    <div className="box-score">{data?.total}</div>
                </div>
            </div>
        </div>
    );
}

function Golfer({ data, onClick, selected, display, direction }) {
    const { width } = useMobile();
    if (!data) {
        return (
            <div className="golfer drop-down-item empty" onClick={onClick} style={display ? { position: "absolute", zIndex: 1, height: `${height(width)}px` } : { height: `${height(width)}px` }}>
                {display ? <img className={"dda " + direction} src="/arrow.png" /> : <></>}
            </div>
        );
    } else if (!data.name || !(data.strokes || data?.strokes === 0) || parseable(data._id) || !(data?.total || data?.total === 0)) {
        throw Error(
            "the golfer component requires data to be non-nullish and the parameters\n    • name: string\n    • strokes: number <int>\n    • index: number <uint_8>\n\n    • total: number\n{",
            JSON.stringify(data),
            "}"
        );
    } else {
        return (
            <div
                className={"golfer drop-down-item" + (selected ? " selected" : "")}
                onClick={onClick}
                style={display ? { position: "absolute", height: `${height(width)}px` } : { height: `${height(width)}px` }}
            >
                <div className="golfer-name" style={{ fontSize: `${fontSize(width)}px` }}>
                    {data.name}
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div className="strokes" style={{ marginRight: `${2 * margin(width)}px` }}>
                        <span style={{ fontSize: `${0.75 * fontSize(width)}px`, fontWeight: 600, color: "var(--bet-text-color)" }}>Strokes</span>
                        <span style={{ fontSize: `${0.9375 * fontSize(width)}px`, fontWeight: 600, color: "var(--bright-text)" }}>{data.strokes}</span>
                    </div>
                    <div className="score">
                        <span style={{ fontSize: `${0.75 * fontSize(width)}px`, fontWeight: 600, color: "var(--bet-text-color)" }}>Score</span>
                        <span style={{ fontSize: `${0.9375 * fontSize(width)}px`, fontWeight: 600, color: goodnessStr(data.total) }}>
                            {data.total > 0 ? "+" : ""}
                            {data.total}
                        </span>
                    </div>
                </div>
                {display ? <img className={"dda " + direction} src="/arrow.png" /> : <></>}
            </div>
        );
    }
}

const errM = "Please pick a golfer";
export default function MastersPlaceBetForm({}) {
    const [p1, setP1] = useState(undefined);
    const [p2, setP2] = useState(undefined);
    const [p3, setP3] = useState(undefined);
    const [p4, setP4] = useState(undefined);
    const [alt1, setAlt1] = useState(undefined);
    const [alt2, setAlt2] = useState(undefined);
    const [alt3, setAlt3] = useState(undefined);
    const [alt4, setAlt4] = useState(undefined);

    const [errors, setErrors] = useState([false, false, false, false, false, false, false, false]);
    const [seeInfo, setSeeInfo] = useState(false);

    const [league, setLeague] = useState(undefined);
    const [leagueErr, setLeagueErr] = useState(false);

    const [opp, setOpp] = useState(undefined);
    const [oppErr, setOppErr] = useState(false);

    const [groups, setGroups] = useState([]);
    const [mode, setMode] = useState("League");
    const [viewing, setViewing] = useState("Starters");

    const { width } = useMobile();
    const { meta } = useAuth();
    const { succeed, failed } = useModal();
    const { golfers, tournament } = useTournament();
    const { t: head2headOpponent, g: fantasyLeague, mode: m1, players, alternates, preload } = usePlayer();

    const router = useRouter();

    const getYourGroups = async () => {
        if (meta?.id || meta.id === 0) {
            const { data: groupIDs, error: errorGroupIDs } = await supabase.from("user_groups").select().eq("userID", meta.id);
            if (!errorGroupIDs && groupIDs.length) {
                let stack = [];
                for (const userGroup of groupIDs) {
                    const { data, error } = await supabase.from("groups").select().eq("groupID", userGroup.groupID).single();
                    if (data && !error) {
                        stack.push(data);
                    }
                }
                setGroups(stack);
            } else {
                setGroups([]);
            }
        }
    };
    useEffect(() => {
        getYourGroups();
    }, [meta]);

    //load from state in DB and router ******************************
    useEffect(() => {
        if (head2headOpponent) {
            setOpp(head2headOpponent);
        }
        setOpp();
    }, [head2headOpponent]);

    useEffect(() => {
        if (fantasyLeague) {
            setLeague(fantasyLeague);
        }
    }, [fantasyLeague]);

    useEffect(() => {
        if (m1) {
            setMode(m1);
        }
    }, [m1]);

    useEffect(() => {
        if (p1) {
            return;
        }
        if (players && players[0] !== undefined) {
            setP1(players[0]);
        }
    }, [players && players[0]]);

    useEffect(() => {
        if (p2) {
            return;
        }
        if (players && players[1] !== undefined) {
            setP2(players[1]);
        }
    }, [players && players[1]]);

    useEffect(() => {
        if (p3) {
            return;
        }
        if (players && players[2] !== undefined) {
            setP3(players[2]);
        }
    }, [players && players[2]]);

    useEffect(() => {
        if (p4) {
            return;
        }
        if (players && players[3] !== undefined) {
            setP4(players[3]);
        }
    }, [players && players[3]]);

    useEffect(() => {
        if (alt1) {
            return;
        }
        if (alternates && alternates[0] !== undefined) {
            setAlt1(alternates[0]);
        }
    }, [alternates && alternates[0]]);

    useEffect(() => {
        if (alt2) {
            return;
        }
        if (alternates && alternates[1] !== undefined) {
            setAlt2(alternates[1]);
        }
    }, [alternates && alternates[1]]);

    useEffect(() => {
        if (alt3) {
            return;
        }
        if (alternates && alternates[2] !== undefined) {
            setAlt3(alternates[2]);
        }
    }, [alternates && alternates[2]]);

    useEffect(() => {
        if (alt4) {
            return;
        }
        if (alternates && alternates[3] !== undefined) {
            setAlt4(alternates[3]);
        }
    }, [alternates && alternates[3]]);

    const handleSubmit = async (e) => {
        e.preventDefault(); //must have this otherwise golfers deload
        if (!mode) {
            failed();
            if (window && !window.hasReloaded) {
                window.hasReloaded = true;
                window.location.reload();
            }
        }

        switch (mode) {
            case "League": {
                if (!(p1 && p2 && p3 && p4)) {
                    setErrors([p1 ? false : true, p2 ? false : true, p3 ? false : true, p4 ? false : true, false, false, false, false]);
                    setLeagueErr(league ? false : true);
                    return;
                }

                if (!league) {
                    setLeagueErr(true);
                    return;
                }
                const players = coerce(p1.index, p2.index, p3.index, p4.index);

                if (!preload) {
                    const { error } = await supabase.from("masters_league").insert({ public_id: meta.id, players: players, league_id: league.groupID, tournament_id: tournament.id });
                    if (error) {
                        if (error.code == 23505) {
                            const { error: e } = await supabase
                                .from("masters_league")
                                .update({ public_id: meta.id, players: players, league_id: league.groupID })
                                .eq("public_id", meta.id)
                                .eq("league_id", league.groupID)
                                .eq("tournament_id", tournament.id);
                            if (e) {
                                failed(e.message);
                            } else {
                                succeed();
                                router.push(`/pga/${tournament.extension}/`);
                            }
                        } else {
                            failed();
                        }
                    } else {
                        succeed();
                        router.push(`/pga/${tournament.extension}/`);
                    }
                } else if (preload) {
                    const { error: e } = await supabase
                        .from("masters_league")
                        .update({ public_id: meta.id, players: players, league_id: league.groupID })
                        .eq("public_id", meta.id)
                        .eq("league_id", league.groupID)
                        .eq("tournament_id", tournament.id);

                    if (e) {
                        failed(e.message);
                    } else {
                        succeed();
                        router.push(`/pga/${tournament.extension}/`);
                    }
                }
            }
            case "Opponent": {
                if (!(p1 && p2 && p3 && p4 && alt1 && alt2 && alt3 && alt4)) {
                    setErrors([p1 ? false : true, p2 ? false : true, p3 ? false : true, p4 ? false : true, alt1 ? false : true, alt2 ? false : true, alt3 ? false : true, alt4 ? false : true]);
                    setOppErr(opp ? false : true);
                    return;
                }

                if (!opp) {
                    setOppErr(true);
                    return;
                }

                const players = coerce(p1.index, p2.index, p3.index, p4.index);
                const alternates = coerce(alt1.index, alt2.index, alt3.index, alt4.index);
                if (!preload) {
                    const { error } = await supabase.from("masters_opponents").insert({ public_id: meta.id, players: players, alternates: alternates, oppie: opp.id, tournament_id: tournament.id });

                    if (error) {
                        if (error.code == 23505) {
                            const { error: e } = await supabase
                                .from("masters_opponents")
                                .update({ public_id: meta.id, players: players, alternates: alternates, oppie: opp.id })
                                .eq("public_id", meta.id)
                                .eq("oppie", opp.id)
                                .eq("tournament_id", tournament.id);
                            if (!e) {
                                succeed();
                                router.push(`/pga/${tournament.extension}/`);
                            } else {
                                failed(error.message);
                            }
                        } else {
                            failed(error.message);
                        }
                    } else {
                        router.push(`/pga/${tournament.extension}/`);
                    }
                } else if (preload) {
                    const { error: e } = await supabase
                        .from("masters_opponents")
                        .update({ public_id: meta.id, players: players, alternates: alternates, oppie: opp.id })
                        .eq("public_id", meta.id)
                        .eq("oppie", opp.id)
                        .eq("tournament_id", tournament.id);
                    if (!e) {
                        succeed();
                        router.push(`/pga/${tournament.extension}/`);
                    } else {
                        failed(e.message);
                    }
                }
            }
        }
    };

    const handleSelect = (data) => {
        //now this is what we call a human rights violation
        setOpp(data);
    };

    //${2*height(width)+80+96+55}px
    return (
        <div className="masters-place-bet-form">
            <div className="pick-box">
                {golfers ? (
                    <>
                        <div className="first-team">
                            <div style={{ margin: `0px ${margin(width)}px`, width: "calc(25% - 20px)" }}>
                                <PickNo num={1} />
                                <div className={"player-selector one " + (errors[0] && !p1 ? "error-wrapper" : "")}>
                                    <DataDropDown data={p1} list={allButThese(golfers, [p2, p3, p4, alt1, alt2, alt3, alt4])} set={setP1} JSX={Golfer} />
                                </div>
                                {errors[0] && !p1 ? <div className="error-message">{errM}</div> : <></>}
                            </div>
                            <div style={{ margin: `0px ${margin(width)}px`, width: "calc(25% - 20px)" }}>
                                <PickNo num={2} />
                                <div className={"player-selector two " + (errors[1] && !p2 ? "error-wrapper" : "")}>
                                    <DataDropDown data={p2} list={allButThese(golfers, [p1, p3, p4, alt2, alt1, alt3, alt4])} set={setP2} JSX={Golfer} />
                                </div>
                                {errors[1] && !p2 ? <div className="error-message">{errM}</div> : <></>}
                            </div>
                            <div style={{ margin: `0px ${margin(width)}px`, width: "calc(25% - 20px)" }}>
                                <PickNo num={3} />
                                <div className={"player-selector thr " + (errors[2] && !p3 ? "error-wrapper" : "")}>
                                    <DataDropDown data={p3} list={allButThese(golfers, [p2, p1, p4, alt3, alt2, alt1, alt4])} set={setP3} JSX={Golfer} />
                                </div>
                                {errors[2] && !p3 ? <div className="error-message">{errM}</div> : <></>}
                            </div>
                            <div style={{ margin: `0px ${margin(width)}px`, width: "calc(25% - 20px)" }}>
                                <PickNo num={4} />
                                <div className={"player-selector for " + (errors[3] && !p4 ? "error-wrapper" : "")}>
                                    <DataDropDown data={p4} list={allButThese(golfers, [p2, p3, p1, alt1, alt2, alt3, alt1])} set={setP4} JSX={Golfer} />
                                </div>
                                {errors[3] && !p4 ? <div className="error-message">{errM}</div> : <></>}
                            </div>
                        </div>
                        {mode === "Opponent" ? (
                            <div className="alternates">
                                <div style={{ margin: `0px ${margin(width)}px`, width: "calc(25% - 20px)" }}>
                                    <PickNo num={5} />
                                    <div className={"player-selector alt-one " + (errors[4] && !alt1 ? "error-wrapper" : "")}>
                                        <DataDropDown data={alt1} list={allButThese(golfers, [p2, p3, p4, p1, alt2, alt3, alt4])} set={setAlt1} JSX={Golfer} />
                                    </div>
                                    {errors[4] && !alt1 ? <div className="error-message">{errM}</div> : <></>}
                                </div>
                                <div style={{ margin: `0px ${margin(width)}px`, width: "calc(25% - 20px)" }}>
                                    <PickNo num={6} />
                                    <div className={"player-selector alt-two " + (errors[5] && !alt2 ? "error-wrapper" : "")}>
                                        <DataDropDown data={alt2} list={allButThese(golfers, [p2, p3, p4, p1, alt1, alt3, alt4])} set={setAlt2} JSX={Golfer} />
                                    </div>
                                    {errors[5] && !alt2 ? <div className="error-message">{errM}</div> : <></>}
                                </div>
                                <div style={{ margin: `0px ${margin(width)}px`, width: "calc(25% - 20px)" }}>
                                    <PickNo num={7} />
                                    <div className={"player-selector alt-thr " + (errors[6] && !alt3 ? "error-wrapper" : "")}>
                                        <DataDropDown data={alt3} list={allButThese(golfers, [p2, p3, p4, p1, alt2, alt1, alt4])} set={setAlt3} JSX={Golfer} />
                                    </div>
                                    {errors[6] && !alt3 ? <div className="error-message">{errM}</div> : <></>}
                                </div>
                                <div style={{ margin: `0px ${margin(width)}px`, width: "calc(25% - 20px)" }}>
                                    <PickNo num={8} />
                                    <div className={"player-selector alt-for " + (errors[7] && !alt4 ? "error-wrapper" : "")}>
                                        <DataDropDown data={alt4} list={allButThese(golfers, [p2, p3, p4, p1, alt2, alt3, alt1])} set={setAlt4} JSX={Golfer} />
                                    </div>
                                    {errors[7] && !alt4 ? <div className="error-message">{errM}</div> : <></>}
                                </div>
                            </div>
                        ) : (
                            <></>
                        )}
                    </>
                ) : (
                    <Loading style={{ margin: "0 auto" }} />
                )}
            </div>
            <Timer cutTime={tournament?.cut_time} />
            <form className="form" onSubmit={(e) => handleSubmit(e)}>
                {!preload ? (
                    <div className="tab-radio">
                        <div
                            className="tab"
                            onClick={
                                preload
                                    ? () => {}
                                    : () => {
                                          setMode("League");
                                          setViewing("Starters");
                                      }
                            }
                            style={mode === "League" ? { backgroundColor: "var(--nav-link-hover-color)" } : {}}
                        >
                            League
                        </div>
                        <div className="tab" onClick={() => (preload ? () => {} : setMode("Opponent"))} style={mode === "Opponent" ? { backgroundColor: "var(--nav-link-hover-color)" } : {}}>
                            Duo
                        </div>
                    </div>
                ) : (
                    <></>
                )}
                <div className="form-header">{mode}</div>
                <div className="form-body">
                    <div className="team">
                        <div className="team-title-wrapper">
                            <div className="team-title" style={viewing === "Starters" ? { backgroundColor: "var(--soft-highlight)" } : {}} onClick={() => setViewing("Starters")}>
                                Starters
                            </div>
                            {mode === "Opponent" ? (
                                <div className="team-title" style={viewing === "Alternates" ? { backgroundColor: "var(--soft-highlight)" } : {}} onClick={() => setViewing("Alternates")}>
                                    Alternates
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="starters">
                            {viewing === "Starters" ? (
                                <>
                                    <StaticGolfer data={p1} />
                                    <StaticGolfer data={p2} />
                                    <StaticGolfer data={p3} />
                                    <StaticGolfer data={p4} />
                                </>
                            ) : (
                                <>
                                    <StaticGolfer data={alt1} />
                                    <StaticGolfer data={alt2} />
                                    <StaticGolfer data={alt3} />
                                    <StaticGolfer data={alt4} />
                                </>
                            )}
                        </div>
                    </div>
                    <div className="actions-golf" style={mode === "League" ? { marginTop: "40px" } : {}}>
                        {mode == "Opponent" ? (
                            preload ? (
                                <WagerStatusWidget />
                            ) : (
                                <>
                                    <Opponent user={opp} />
                                    <div className="user-search">
                                        <Search name="users" fields={["username"]} table="public_users" JSX={UserSearchResult} onSelect={handleSelect} err={oppErr && !opp} />
                                    </div>
                                </>
                            )
                        ) : (
                            <></>
                        )}
                        {mode === "League" ? (
                            preload ? (
                                <Group data={league} display={false} />
                            ) : (
                                <>
                                    <div className={`your-group-selector ${leagueErr && !league ? "erred-group" : ""}`} style={leagueErr ? { marginBottom: "0px" } : {}}>
                                        <DataDropDown list={groups} set={setLeague} JSX={Group} />
                                    </div>
                                    {leagueErr && !league ? <span style={{ color: "var(--danger)", marginTop: "5px" }}>Please select a group</span> : <></>}
                                </>
                            )
                        ) : (
                            <></>
                        )}
                        <div className="projection" style={preload ? { top: 0 } : { paddingTop: "10px", top: "0" }}>
                            Your team is projected to score <span className="number">{isNaN(getTeamProjection(p1, p2, p3, p4)) ? "-" : getTeamProjection(p1, p2, p3, p4)}.</span>
                        </div>

                        {preload ? (
                            <button type="submit" className="cta-button" style={{ padding: "6px 24px" }}>
                                <img src="/save.png" style={{ height: "24px" }} />
                            </button>
                        ) : (
                            <button type="submit" className="cta-button">
                                Submit
                            </button>
                        )}
                    </div>
                </div>
            </form>
            <MastersInfoModal isOpen={seeInfo} onClose={() => setSeeInfo(false)} />
        </div>
    );
}

export { Group, PickNo, StaticGolfer, Golfer, GolferSelector, TournamentWidget, WagerStatusWidget };
