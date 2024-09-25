import { contentFromOId, tokenSum } from "../../functions/Bet2Ops";
import { useEffect, useState } from "react";
import { supabase } from "../../functions/SupabaseClient";

import WagerUser from "./WagerUser";

const complexWagerSorter = (a, b, uid) => {
    if (uid === a.uid) {
        return -Infinity;
    }
    if (uid === b.uid) {
        return Infinity;
    }
    return b.amount - a.amount;
};

export default function WagerList({ bet, uid }) {
    console.log(uid);
    return (
        <div
            className="wager-list popped"
            style={{ backgroundColor: "var(--bet-background-color)" }}
        >
            <div className="wager-title title">Bets placed</div>
            {bet.wagers ? (
                bet.wagers
                    .sort((a, b) => complexWagerSorter(a, b, uid))
                    .map((wager, i) => (
                        <Wager
                            key={String(bet.id) + ":" + String(i)}
                            wager={wager}
                            options={bet.options}
                            uid={uid}
                        />
                    ))
            ) : (
                <Loading />
            )}
        </div>
    );
}

function Wager({ key, wager, options, uid }) {
    const [user, setUser] = useState(undefined);

    useEffect(() => {
        const getUser = async () => {
            const { data: user, error } = await supabase
                .from("public_users")
                .select()
                .eq("id", wager.uid)
                .single();

            if (!error) {
                setUser(user);
            }
        };

        getUser();
    }, []);

    const yours = uid === wager.uid;

    return (
        <div
            className="wager popped angled"
            key={key}
            style={{
                backgroundColor: yours
                    ? "var(--bring-forward-gray)"
                    : "var(--highlighted-dark)",
                padding: "10px",
                width: "255px",
                borderRadius: "16px",
                margin: "6px auto"
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}
            >
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontWeight: 600, fontSize: "20px" }}>
                        {tokenSum(wager.amount)}
                    </div>
                    <div
                        title="Tokens"
                        style={{
                            color: "var(--unimportant-text)",
                            fontSize: "16px"
                        }}
                    >
                        Amount
                    </div>
                </div>

                <div>
                    <div style={{ fontWeight: 600, fontSize: "20px" }}>
                        {contentFromOId(wager.oid, options)}
                    </div>
                    <div
                        style={{
                            color: "var(--unimportant-text)",
                            fontSize: "16px"
                        }}
                    >
                        Option
                    </div>
                </div>
            </div>

            {user && <WagerUser user={user} />}
        </div>
    );
}
