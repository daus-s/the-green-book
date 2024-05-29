import { Group, StaticGolfer, GolferSelector, WagerStatusWidget } from "./MastersBetPlaceForm";
import { getTeamProjection, golfer } from "../functions/GolfFunctions";
import { useEffect, useState } from "react";
import { coerce, partition } from "../functions/RandomBigInt";
import { useTournament } from "./providers/TournamentContext";
import { supabase } from "../functions/SupabaseClient";
import { useModal } from "./providers/ModalContext";
import { useAuth } from "./providers/AuthContext";

import MastersInfoModal from "./modals/MastersInfoModal";
import Opponent from "./Opponent";
import Loading from "./Loading";
import { usePlayer } from "./providers/PlayerContext";

export default function PreloadedPGAForm({ payload }) {
    const { golfers } = useTournament();
    const { succeed, failed } = useModal();
    const { meta } = useAuth();
    const { players, alternates } = usePlayer();

    const [p1, setP1] = useState(players ? players[0] : undefined);
    const [p2, setP2] = useState(players ? players[1] : undefined);
    const [p3, setP3] = useState(players ? players[2] : undefined);
    const [p4, setP4] = useState(players ? players[3] : undefined);
    const [alt1, setAlt1] = useState(alternates ? alternates[0] : undefined);
    const [alt2, setAlt2] = useState(alternates ? alternates[1] : undefined);
    const [alt3, setAlt3] = useState(alternates ? alternates[2] : undefined);
    const [alt4, setAlt4] = useState(alternates ? alternates[3] : undefined);

    const [errors, setErrors] = useState([false, false, false, false, false, false, false, false]);
    const [seeInfo, setSeeInfo] = useState(false);

    const [viewing, setViewing] = useState("Starters");

    const { g: group, t: opp, mode } = usePlayer();

    useEffect(() => {
        setP1(players ? players[0] : undefined);
        setP2(players ? players[1] : undefined);
        setP3(players ? players[2] : undefined);
        setP4(players ? players[3] : undefined);
    }, [players]);

    // Synchronize state with alternates prop
    useEffect(() => {
        setAlt1(alternates ? alternates[0] : undefined);
        setAlt2(alternates ? alternates[1] : undefined);
        setAlt3(alternates ? alternates[2] : undefined);
        setAlt4(alternates ? alternates[3] : undefined);
    }, [alternates]);

    const handleSubmit = async (e) => {
        e.preventDefault(); //must have this otherwise golfers deload
        if (mode === "Opponent") {
            if (!(p1 && p2 && p3 && p4 && alt1 && alt2 && alt3 && alt4)) {
                setErrors([p1 ? false : true, p2 ? false : true, p3 ? false : true, p4 ? false : true, alt1 ? false : true, alt2 ? false : true, alt3 ? false : true, alt4 ? false : true]);
                setOppErr(opp ? false : true);
                return;
            }
        } else if (mode === "League") {
            //then we do DFS mode
            if (!(p1 && p2 && p3 && p4)) {
                setErrors([p1 ? false : true, p2 ? false : true, p3 ? false : true, p4 ? false : true, false, false, false, false]);
                setLeagueErr(league ? false : true);
                return;
            }
        }
        //compression xd

        if (mode === "League") {
            if (!league) {
                setLeagueErr(true);
                return;
            }
            const players = coerce(p1.index, p2.index, p3.index, p4.index);

            // console.log('columns');
            // console.log('userID', meta.id);
            // console.log('players', players);
            // console.log('leagueID', league.groupID);
            const { error } = await supabase.from("masters_league").insert({ public_id: meta.id, players: players, league_id: league.groupID });
            if (error) {
                if (error.code == 23505) {
                    const { error: e } = await supabase
                        .from("masters_league")
                        .update({ public_id: meta.id, players: players, league_id: league.groupID })
                        .eq("public_id", meta.id)
                        .eq("league_id", league.groupID);
                    if (e) {
                        failed(e.message);
                    } else {
                        succeed();
                        window.location.href = "/pga";
                    }
                } else {
                    failed(error.message);
                }
            } else {
                succeed();
                window.location.href = "/pga";
            }
        } else if (mode === "Opponent") {
            if (!opp) {
                setOppErr(true);
                return;
            }
            const players = coerce(p1.index, p2.index, p3.index, p4.index);
            const alternates = coerce(alt1.index, alt2.index, alt3.index, alt4.index);

            // console.log('columns');
            // console.log('userID:', meta.id);
            // console.log('players:', players);
            // console.log('alternates:', alternates);
            // console.log('opponentID:', opp.id);

            const { error } = await supabase.from("masters_opponents").insert({ public_id: meta.id, players: players, alternates: alternates, oppie: opp.id });

            if (error) {
                if (error.code == 23505) {
                    const { error: e } = await supabase
                        .from("masters_opponents")
                        .update({ public_id: meta.id, players: players, alternates: alternates, oppie: opp.id })
                        .eq("public_id", meta.id)
                        .eq("oppie", opp.id);
                    if (!e) {
                        succeed();
                        window.location.href = "/pga";
                    } else {
                        failed(error.message);
                    }
                } else {
                    failed(error.message);
                }
            } else {
                window.location.href = "/pga";
            }
        }
    };

    const errM = "Please pick a golfer";
    return golfers ? ( //                               ${2*height(width)+80+96+55}px
        <div className="masters-place-bet-form">
            {/* {players?.map((p) => {
                return <div>{JSON.stringify(p)}</div>;
            })} */}
            <div className="pick-box" style={{ height: "100%", maxHeight: "373px" }}>
                <div className="first-team">
                    {[p1, p2, p3, p4].map((player, index) => {
                        return (
                            <GolferSelector
                                player={player}
                                golfers={golfers}
                                index={index}
                                error={errors[index]}
                                list={[p1, p2, p3, p4, alt1, alt2, alt3, alt4]}
                                set={[setP1, setP2, setP3, setP4][index]}
                                errM={errM}
                                key={player ? player.index : index + 4}
                            />
                        );
                    })}
                </div>
                {mode === "Opponent" ? (
                    <div className="alternates">
                        {[alt1, alt2, alt3, alt4].map((player, index) => {
                            // player ? console.log("rendering ", player?.name, "...") : console.log("failed to render a player: NO INPUT ");
                            return (
                                <GolferSelector
                                    player={player}
                                    golfers={golfers}
                                    index={index}
                                    error={errors[index + 4]}
                                    list={[p1, p2, p3, p4, alt1, alt2, alt3, alt4]}
                                    set={[setAlt1, setAlt2, setAlt3, setAlt4][index]}
                                    errM={errM}
                                    key={player ? player.index : index + 4}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <form className="form" onSubmit={(e) => handleSubmit(e)}>
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
                            <>
                                <Opponent user={opp} />
                            </>
                        ) : (
                            <></>
                        )}
                        {mode === "League" ? <Group data={group} onClick={() => {}} display={false} direction={""} selected={false} /> : <></>}
                        <div className="projection">
                            Your team is projected to score <span className="number">{isNaN(getTeamProjection(p1, p2, p3, p4)) ? "-" : getTeamProjection(p1, p2, p3, p4)}.</span>
                        </div>

                        <button type="submit" className="cta-button" style={{ padding: "10px" }}>
                            <img src="/save.png" alt="confirm team" style={{ height: "24px" }} />
                        </button>
                    </div>
                </div>
            </form>
            {mode === "Opponent" ? <WagerStatusWidget /> : <></>}
            <MastersInfoModal isOpen={seeInfo} onClose={() => setSeeInfo(false)} />
        </div>
    ) : (
        <Loading />
    );
}
