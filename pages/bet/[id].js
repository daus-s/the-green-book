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
    const meta = useAuth();

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
            console.log(bets);
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

    return bet ? (
        <div className="bet-layout" style={{ marginTop: "108px" }}>
            <Bet2 bet={bet} />
            <WagerList bet={bet} />
            {isOwner ? <BetManager bet={bet} /> : null}
        </div>
    ) : null;
}
