import {
    sfo,
    asFunctionOfShare,
    percentForOpt,
    validate,
    tokenSum,
    userPick,
    firstOpenOId,
    predictedWinning
} from "../functions/Bet2Ops";
import { useEffect, useState } from "react";
import { partialEqual } from "../functions/AllButThisJSON";
import { supabase } from "../functions/SupabaseClient";
import { useModal } from "./providers/ModalContext";
import { useAuth } from "./providers/AuthContext";
import isEqual from "lodash/isEqual";

import Ackerman from "./Ackerman";
import Loading from "./Loading";
import Image from "next/image";
import { numLength } from "../functions/RandomBigInt";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

export default function Bet({ bet }) {
    if (!bet) {
        return <Loading />;
    }
    if (!validate(bet)) {
        return <></>;
    }
    //can we create a function here that reloads this bet in particular, it may be 1 level up

    return <BetD bet={bet} key={bet.id} />;
}

function BetD({ bet, key }) {
    const [clicked, setClicked] = useState(null);

    const setClickedWrapper = (arg) => {
        const pick = userPick(bet, meta?.id);
        if (pick === null) {
            setClicked(arg);
        }
    };

    const options = bet.options;
    const wagers = bet.wagers;

    const { meta } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const optKVPs = sfo(options, wagers, meta);
    const pick = userPick(bet, meta?.id);

    useEffect(() => {
        if (!meta?.id) {
            return;
        }
        const pick1 = userPick(bet, meta.id);
        if (!pick1) {
            return;
        }
        setClicked(pick1);
    }, [meta]);

    console.log(pathname);
    return (
        <div
            className="over-under bet bet2-layout popped"
            key={String(bet.id).concat(String(key))}
        >
            <IconBox bet={bet} />
            {pathname.includes("/bets") ? (
                <div
                    className="title"
                    onClick={() => {
                        router.push("/bet/" + String(bet.id));
                    }}
                    style={{ cursor: "pointer" }}
                >
                    {bet.content}
                </div>
            ) : (
                <div className="title">{bet.content}</div>
            )}
            <div className="options-container">
                {Array.isArray(optKVPs)
                    ? optKVPs
                          .sort((a, b) => b.sum - a.sum)
                          .map((kvp, index) => (
                              <Option
                                  option={kvp.option}
                                  wagers={wagers}
                                  sum={kvp.sum}
                                  pick={pick ? pick.oid : null}
                                  key={index}
                                  line={bet.line ?? null}
                                  clicked={clicked}
                                  setClicked={setClickedWrapper}
                              />
                          ))
                    : () => {}}
                {pick === null ? (
                    <NewOption
                        bet={bet}
                        clicked={clicked}
                        setClicked={setClickedWrapper}
                    />
                ) : (
                    <></>
                )}
            </div>
            <WagerMenu bet={bet} pick={pick ? pick.oid : clicked} />
        </div>
    );
}

function Option({ option, wagers, sum, pick, line, clicked, setClicked }) {
    const lineString = String(line ? line : "");
    let percent = percentForOpt(option.oid, wagers); //we need to make a decision of how to handle this result here...
    if (isNaN(percent)) {
        percent = 0;
    }

    const [hover, setHover] = useState(false);

    let oppColor;

    const status =
        pick === null ? "" : pick === option.oid ? "selected" : "not-selected";
    if (isEqual(option, clicked) || status === "selected") {
        oppColor = "var(--cta-button-bg-color)";
    } else if (status === "not-selected") {
        oppColor = "var(--not-your-pick)";
    } else {
        oppColor = "var(--bet-option-highlight)";
    }

    const imps = asFunctionOfShare(percent);
    const tokenNumber = tokenSum(sum);

    return (
        <div
            className={"option client popped angled " + status}
            onClick={() => setClicked(option)}
        >
            <Ackerman percent={percent} oColor={oppColor} />
            <div className="info">
                <div className="option-name">
                    {option.content + " " + lineString}
                </div>
                <div
                    className="stat"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                >
                    {hover ? tokenNumber : imps}
                </div>
            </div>
        </div>
    );
}

function NewOption({ bet, clicked, setClicked }) {
    const [active, setActive] = useState(false);
    const [option, setOption] = useState("");

    const handleClickAlways = () => {
        if (!active) {
            setActive(true);
        }
        setClicked({
            bid: bet.id,
            oid: firstOpenOId(bet.options),
            winner: false,
            content: option
        });
    };

    useEffect(() => {
        if (
            !option &&
            !partialEqual(
                clicked,
                {
                    bid: bet.id,
                    oid: firstOpenOId(bet.options),
                    winner: false,
                    content: option
                },
                "content"
            )
        ) {
            setActive(false);
        }
    }, [clicked]);

    return (
        <div
            className="option client new"
            onClick={handleClickAlways}
            style={
                partialEqual(
                    clicked,
                    {
                        bid: bet.id,
                        oid: firstOpenOId(bet.options),
                        winner: false,
                        content: option
                    },
                    "content"
                )
                    ? { border: "4px solid var(--cta-button-bg-color)" }
                    : {}
            }
        >
            {active ? (
                <>
                    <input
                        className="option-title"
                        value={option}
                        onChange={(e) => setOption(e.target.value)}
                        placeholder="Option"
                    />
                </>
            ) : (
                <>
                    Create new option{" "}
                    <Image
                        src="/addbet.png"
                        height={20}
                        width={20}
                        alt="Add new option."
                    />
                </>
            )}
        </div>
    );
}

function WagerMenu({ bet, pick }) {
    const { meta } = useAuth();

    return (
        <div className="wager-manager">
            <div className="to-win">
                <div className="potential">
                    {tokenSum(predictedWinning(bet, meta?.id ?? null))}
                </div>
                <div className="descriptor">To Win</div>
            </div>
            <div className="wagered">
                <div className="potential">
                    {tokenSum(userPick(bet, meta?.id)?.amount ?? 0)}
                </div>
                <div className="descriptor">Wagered</div>
            </div>
            <AddWager bet={bet} pick={pick} />
        </div>
    );
}

function IconBox({ bet }) {
    const [group, setGroup] = useState(undefined);

    useEffect(() => {
        const getGroup = async () => {
            const { data: group, error } = await supabase
                .from("groups")
                .select()
                .eq("groupID", bet.g)
                .single();
            if (!error) {
                setGroup(group);
            }
        };

        getGroup();
    }, []);
    return (
        <div
            className="icon-box"
            style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end"
            }}
        >
            {bet.public ? (
                <Image src="/earth.png" title="Public" width={30} height={30} />
            ) : (
                <Image
                    src="/private.png"
                    title={group ? `Group: ${group.groupName}` : "Private"}
                    width={30}
                    height={30}
                />
            )}
        </div>
    );
}

function AddWager({ bet, pick }) {
    const { failed, succeed } = useModal();
    const [wager, setWager] = useState("");
    const { meta } = useAuth();

    const handleChange = (e) => {
        if (!e.target.value) {
            setWager("");
        }
        const num = parseInt(e.target.value);
        if (!isNaN(num)) {
            //bound by this on the upper +2,147,483,647
            if (!(num > 2_147_483_647 || num <= 0)) {
                setWager(num);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase.rpc("place_wager2", {
            _amount: wager,
            _bid: bet.id,
            _oid: pick?.oid // Add optional chaining to prevent errors
        });

        if (error || data) {
            failed();
        } else {
            succeed();
        }

        setWager("");
        // Additional logic for updating the user's wager here
    };

    const size = [
        "32px",
        "32px",
        "32px",
        "32px",
        "30px",
        "26px",
        "22px",
        "19px",
        "17px",
        "15px",
        "13px"
    ];

    return (
        <form
            className="wager-control-panel popped angled"
            onSubmit={handleSubmit}
        >
            <div className="input-group">
                <label htmlFor={`add-${bet.id}`} className="wager-label">
                    {userPick(bet, meta?.id) ? "Increase Wager" : "Place Bet"}
                </label>
                <input
                    id={`add-${bet.id}`}
                    className="wager-input"
                    value={wager}
                    onChange={handleChange}
                    placeholder="0"
                    style={{
                        height: "44px",
                        fontSize:
                            size[
                                Math.min(numLength(wager) - 1, size.length - 1)
                            ],
                        overflowX: "hidden",
                        textAlign: "center"
                    }}
                />
            </div>
            <button
                className="submit-button popped"
                disabled={!pick || !wager}
                style={{ marginLeft: "5px" }}
            >
                {userPick(bet, meta?.id) ? "Add" : "Place"}
            </button>
        </form>
    );
}
