import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useBets } from "../../components/providers/BetProvider";
import Bet2 from "../../components/Bet2";
import { useAuth } from "../../components/providers/AuthContext";
import WagerList from "../../components/bets/WagerList";
import BetManager from "../../components/bets/BetManager";

export default function Bet() {
    const [bet, setBet] = useState(undefined);

    const router = useRouter();
    const bets = useBets();
<<<<<<< HEAD
    const { meta } = useAuth();
=======
    const meta = useAuth();
>>>>>>> b06d4ac (WIP: new bet page for indivudal bets)

    useEffect(() => {
        if (!router) {
            //router hasn't instantiated yet
            return;
        } else if (!meta) {
            //account meta data hasn't instantiated yet
            return;
        } else if (!bets?.bets) {
            //bet objects arent loaded
            return;
        } else if (meta && router) {
            const queryId = router.query.id;
<<<<<<< HEAD
=======
            console.log(bets);
>>>>>>> b06d4ac (WIP: new bet page for indivudal bets)
            for (const bet of bets.bets) {
                if (parseInt(queryId) === bet.id) {
                    setBet(bet);
                    return;
                }
            }
            router.push("/bets");
        }
    }, [router, meta, bets]);

    const isOwner = bet?.creator === meta?.id;
<<<<<<< HEAD
    console.log(isOwner);
    console.log(meta);

    return bet ? (
        <div className="bet-page-layout" style={{ marginTop: "121px" }}>
            <Bet2 bet={bet} />
            <WagerList bet={bet} uid={meta.id} />
=======

    return bet ? (
        <div className="bet-layout" style={{ marginTop: "108px" }}>
            <Bet2 bet={bet} />
            <WagerList bet={bet} />
>>>>>>> b06d4ac (WIP: new bet page for indivudal bets)
            {isOwner ? <BetManager bet={bet} /> : null}
        </div>
    ) : null;
}
