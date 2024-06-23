import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../../functions/SupabaseClient";
import { validateUrlext } from "../../functions/ParseSchema";
import { decode } from "../../functions/Encode";
import { useAuth } from "./AuthContext";
import { useTournament } from "./TournamentContext";
import { partition } from "../../functions/RandomBigInt";
import { golferViaIndex } from "../../functions/GolfFunctions";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
    const { meta } = useAuth();
    const { golfers } = useTournament();

    // * * * * *  internal varaiables used to calculate stuff * * * * * //
    const [u, setU] = useState(undefined);
    const [t, setT] = useState(undefined);
    const [g, setG] = useState(undefined);

    // * * * * *  user and opponent data  * * * * * //
    const [ubet, setUbet] = useState(false);
    const [tbet, setTbet] = useState(false);

    const [bet, setBet] = useState(undefined);

    const [preload, setPreload] = useState(false);

    // * * * * * integers representing selections * * * * *  //
    const [players, setPlayers] = useState(undefined);
    const [alternates, setAlternates] = useState(undefined);

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
        const { data: x, error: xErr } = await supabase
            .from("masters_opponents_e")
            .select()
            .or(`and(a.eq.${t.id}, b.eq.${u.id}), and(b.eq.${t.id}, a.eq.${u.id})`)
            .eq("tournament_id", tour?.id)
            .limit(1)
            .single();

        if (!xErr && x) {
            setUbet(u.id === x.a ? x.ac : x.bc);
            setTbet(t.id === x.a ? x.ac : x.bc);
        } else if (xErr) {
            return;
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
            console.log("getting group frfr with argument");
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
            console.log("getting group");
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
            } else if (err.code === "PGRST116") {
                const { error: insertError } = await supabase.from("masters_opponents").insert({
                    oppie: decode(oppID),
                    public_id: meta.id,
                    tournament_id: tour.id,
                });
                if (insertError) {
                    router.push(`/pga/${router.query.tournament}/place`);
                }
            } else if (typeof window !== "undefined" && router) {
                router.push(`/pga/${router.query.tournament}/place`);
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
        if (str.charAt(0) === "@") {
            return "Opponent";
        }
        if (str.charAt(0) === "$") {
            return "League";
        }
    };

    useEffect(() => {
        if (router?.query?.enc) {
            setMode(getMode(router.query.enc));
            setPreload(true);
        }
    }, [router]);
    return <PlayerContext.Provider value={{ tour, u, t, g, tbet, ubet, bet, players, alternates, mode, preload }}>{children}</PlayerContext.Provider>;
};
