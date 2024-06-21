import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../functions/SupabaseClient";
import { validateUrlext, goodFantasy, goodHead2Head } from "../../functions/ParseSchema";
import { decode } from "../../functions/Encode";
import { useAuth } from "./AuthContext";
import { useTournament } from "./TournamentContext";
import { partition } from "../../functions/RandomBigInt";
import { golferViaIndex } from "../../functions/GolfFunctions";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const { meta } = useAuth();
    const { golfers, tournament } = useTournament();

    // * * * * *  internal varaiables used to calculate stuff * * * * * //
    const [u, setU] = useState(undefined);
    const [t, setT] = useState(undefined);
    const [g, setG] = useState(undefined);

    // * * * * *  user and opponent data  * * * * * //
    const [ubet, setUbet] = useState(false);
    const [tbet, setTbet] = useState(false);

    const [bet, setBet] = useState(undefined);

    // * * * * * integers representing selections * * * * *  //
    const [players, setPlayers] = useState(null);
    const [alternates, setAlternates] = useState(null);

    // * * * * *  database objects  * * * * * //
    const [tour, setTour] = useState(undefined);

    const [mode, setMode] = useState(undefined);

    const router = useRouter();

    useEffect(() => {
        const getTournamentMetaData = async () => {
            if (router?.query?.tournament) {
                const sel = router.query.tournament;
                if (validateUrlext(sel)) {
                    const { data, error } = await supabase.from("tournaments").select().eq("extension", sel).single();
                    if (error) {
                        router.push("/pga");
                    } else {
                        if (data) {
                            setTour(data);
                        }
                    }
                } else {
                    router.push("/pga");
                }
            }
            const char = router?.query?.enc?.charAt(0);
            if (char) {
                if (char === "@") {
                    setMode("Opponent");
                }
                if (char === "$") {
                    setMode("League");
                }
            }
        };

        getTournamentMetaData();
    }, [router]);

    const getBetsAndExtancy = async () => {
        if (!tour?.id || !u?.id || !t?.id) {
            //its ok to not return anything from this function, it will normally only modify state()
            return;
        }
        if (!mode || (mode && mode === "League")) {
            return;
        }
        //e for extant
        const { data: x, error: xErr } = await supabase.from("masters_opponents_e").select().eq("a", u?.id).eq("b", t?.id).eq("tournament_id", tour?.id).limit(1);

        if (!xErr && x.length) {
            setUbet(x[0].ac);
            setTbet(x[0].bc);
        } else if (xErr) {
            return;
        } else if (!x.length) {
            const { data: y, error: yErr } = await supabase.from("masters_opponents_e").select().eq("a", t?.id).eq("b", u?.id).eq("tournament_id", tour?.id).limit(1);
            if (!yErr && y.length) {
                setUbet(y[0].ac);
                setTbet(y[0].bc);
            }
        }
    };

    useEffect(() => {
        getBetsAndExtancy();
    }, [u, t, tour]);

    const getUsers = async () => {
        if (meta?.id) {
            const { data, error } = await supabase.from("public_users").select().eq("id", meta.id).single();
            if (!error) {
                setU(data);
            }
        }
        if (router?.query?.enc && mode === "Opponent") {
            const { data, error } = await supabase
                .from("public_users")
                .select()
                .eq("id", decode(router.query.enc.substring(1)))
                .single();
            if (!error) {
                setT(data);
            } else {
                router.push("/pga/" + router.query.tournament + "/");
            }
        }
    };

    const getGroup = async () => {
        if (router?.query?.enc) {
            const { data, error } = await supabase
                .from("groups")
                .select()
                .eq("groupID", decode(router.query.enc.substring(1)))
                .single();
            if (!error) {
                setG(data);
            } else {
                router.push("/pga/" + router.query.tournament + "/");
            }
        }
    };

    useEffect(() => {
        getUsers();
        if (mode === "League") {
            getGroup();
        }
    }, [mode, meta, router]);
    /**
     * tour: TournamentSupabaseObject = {
     *      id int;
     *      tournament_name text;
     *      cut_time dtz;
     *      extension text;
     *      mongodb_endpoint jsonb;
     * }
     * u, t PublicUserSupabaseObject = {
     *      id int;
     *      email text; --change this
     *      username text;
     *
     * }
     *
     */

    const getRosters = async () => {
        if (!bet || !golfers) {
            return;
        }
        //starter loading
        if (!bet.players) {
            setPlayers([undefined, undefined, undefined, undefined]);
        } else {
            const ps = [];
            partition(bet.players).map((id) => {
                ps.push(golferViaIndex(id, golfers));
            });
            setPlayers(ps);
        }
        //alternate loading
        if (!bet.alternates) {
            setAlternates([undefined, undefined, undefined, undefined]);
        } else {
            const as = [];
            partition(bet.alternates).map((id) => {
                as.push(golferViaIndex(id, golfers));
            });
            setAlternates(as);
        }
    };

    useEffect(() => {
        getRosters();
    }, [golfers, bet]);

    const getBet = async (modeString, thirdPartyID, urID, tourID) => {
        if (modeString === "Opponent") {
            const { data: bet, error: err } = await supabase.from("masters_opponents").select().eq("public_id", urID).eq("oppie", thirdPartyID).eq("tournament_id", tourID).single();
            if (!err) {
                setBet(bet);
                if (bet.players && bet.alternates) {
                    setPlayers(bet.players);
                    setAlternates(bet.alternates);
                }
            }
        } else if (modeString === "League") {
            const { data: bet, error: err } = await supabase.from("masters_league").select().eq("public_id", urID).eq("league_id", thirdPartyID).eq("tournament_id", tourID).single();
            if (!err) {
                setBet(bet);
                if (bet.players) {
                    setPlayers(bet.players);
                    setUbet(true);
                }
            }
        }
    };

    useEffect(() => {
        if (mode && (mode === "Opponent" ? t?.id : g?.groupID) && u?.id && tour?.id) {
            let isPopulatedYet = mode === "League" ? Boolean(players && alternates) : Boolean(players);
            if (!isPopulatedYet) {
                getBet(mode, mode === "Opponent" ? t.id : g.groupID, u.id, tour.id);
            }
        }
    }, [u, t, tour, mode]);

    const getMode = (str) => {
        if (str.charAt() === "@") {
            return "Opponent";
        }
        if (str.charAt() === "$") {
            return "League";
        }
    };

    useEffect(() => {
        if (router?.query?.enc) {
            setMode(getMode(router.query.enc));
        }
    }, [router]);
    return <PlayerContext.Provider value={{ tour, u, t, g, tbet, ubet, bet, players, alternates, mode }}>{children}</PlayerContext.Provider>;
};
