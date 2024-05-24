import { useMobile } from "./providers/MobileContext.js";
import { useEffect, useState } from "react";
import { supabase } from "../functions/SupabaseClient";
import Loading from "./Loading.js";

//add a criteria that is being searched on and pass it here
function NoSuchUser({ criteria }) {
    const { isMobile } = useMobile();

    let c = criteria ? criteria : "username"; //default to username unitl this is implmented
    return (
        <div className="no-such-user" style={isMobile ? { paddingLeft: "48px" } : {}}>
            <div className="error-title">No such user.</div>
            <div className="criteria">Criteria: {c}</div>
        </div>
    );
}

function UserBalance({ user }) {
    const [value, setValue] = useState(user.user_balances.balance);
    const [edit, setEdit] = useState(false);

    const { isMobile } = useMobile();

    //value is an int here
    const setNewBalance = async () => {
        //value is a string here
        // wtf...
        const { error } = await supabase
            .from("user_balances")
            .update({ balance: parseInt(value) })
            .eq("userID", user.userID);
        if (!error) {
            setEdit(false);
            user.user_balances.balance = value;
        }
    };
    useEffect(() => {
        setValue(user.user_balances.balance);
    }, [user]);

    return (
        <div className="user-balance" style={isMobile ? { ...mobileStyles.row } : {}}>
            <div className="pfp" style={isMobile ? { ...mobileStyles.row.pfp } : {}}>
                <img src={user.public_users.pfp_url} style={isMobile ? { ...mobileStyles.row.pfp.img } : {}} />
            </div>
            <div className="username" style={isMobile ? { ...mobileStyles.row.username } : {}}>
                {user.username}
            </div>
            {edit ? (
                <input
                    className="balance"
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    onBlur={setNewBalance}
                    style={isMobile ? { ...mobileStyles.row.balance } : {}}
                />
            ) : (
                <div className="balance" onClick={() => setEdit((prev) => !prev)} style={isMobile ? { ...mobileStyles.row.balance } : {}}>
                    {user.user_balances.balance}
                </div>
            )}
        </div>
    );
}

export default function BalanceTable() {
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState(""); //i hate truthy in javascript
    const [data, setData] = useState([]);
    const [page, setPage] = useState(0);
    const [ids, setIDs] = useState([""]); //it looks like stairs

    const { isMobile } = useMobile();

    const selectInitBalances = async () => {
        const getUsers = async () =>
            page
                ? await supabase
                      .from("users")
                      .select("*, user_balances ( balance ), public_users!public_users_username_fkey ( * )")
                      .ilike("username", `${query ? query : ""}*`)
                      .order("userID")
                      .limit(5)
                      .gt("userID", ids[ids.length - 1])
                : await supabase
                      .from("users")
                      .select("*, user_balances ( balance ), public_users!public_users_username_fkey ( * )")
                      .ilike("username", `${query ? query : ""}*`)
                      .order("userID")
                      .limit(5);
        const { data: users, error } = await getUsers();
        if (users) {
            setData(users);
            const shallow = [...ids];
            if (users.length) {
                shallow.pop();
                shallow.push(users[users.length - 1].userID); //get last element and pick the ids
                setIDs(shallow);
            } else {
                setIDs([""]);
            }
            setIDs(shallow);
            setLoading(false);
        }
        if (error) {
            setLoading(true);
        }
    };

    const selectPrevBalances = async () => {
        let pageCopy = page;
        if (pageCopy > 0) {
            const shallow = [...ids];
            shallow.pop();
            const getUsers = async () =>
                pageCopy === 1
                    ? await supabase
                          .from("users")
                          .select("*, user_balances ( balance ), public_users!public_users_username_fkey ( * )")
                          .ilike("username", `${query ? query : ""}*`)
                          .order("userID")
                          .limit(5)
                    : await supabase
                          .from("users")
                          .select("*, user_balances ( balance ), public_users!public_users_username_fkey ( * )")
                          .ilike("username", `${query ? query : ""}*`)
                          .order("userID")
                          .limit(5)
                          .lte("userID", shallow[shallow.length - 1])
                          .gt("userID", shallow[shallow.length - 2]);
            const { data: users, error } = await getUsers();
            if (!error) {
                if (users.length) {
                    setData(users);
                    setIDs(shallow);
                }
                setPage((p) => p - 1);
                setLoading(false);
            } else if (error) {
                setLoading(true);
            }
        }
    };

    useEffect(() => {
        setPage(0);
        setIDs([""]);
        selectInitBalances();
    }, [query]);

    const selectNextBalances = async () => {
        const shallow = [...ids];

        const getUsers = async () =>
            await supabase
                .from("users")
                .select("*, user_balances ( balance ), public_users!public_users_username_fkey ( * )")
                .ilike("username", `${query ? query : ""}*`)
                .order("userID")
                .limit(5)
                .gt("userID", shallow[shallow.length - 1]);
        const { data: users, error } = await getUsers();
        if (users) {
            if (users.length) {
                if (!shallow.includes(users[users.length - 1].userID)) {
                    shallow.push(users[users.length - 1].userID); //get last element and pick the ids
                    setData(users);
                    setPage((p) => p + 1);
                }
            }
            setIDs(shallow);
            setLoading(false);
        }
        if (error) {
            setLoading(true);
        }
    };

    useEffect(() => {
        selectInitBalances();
    }, []);

    const goLeft = () => {
        selectPrevBalances();
    };

    const goRight = () => {
        selectNextBalances();
    };

    const list = data.filter((userData) => userData.username.startsWith(query)).map((userData) => <UserBalance user={userData} />);
    return (
        <div className="balance-table admin-child" style={isMobile ? { ...mobileStyles.table } : {}}>
            <div className="query">
                <img className="search-icon" src="/search.png" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                    }}
                    placeholder="search users..."
                />
            </div>
            <div className="user-balance title">
                <div className="pfp" style={isMobile ? mobileStyles.row.pfp : {}} />
                <div className="username" style={{ fontWeight: 400, fontSize: 24, ...(isMobile ? mobileStyles.row.username : {}) }}>
                    Username
                </div>
                <div className="balance" style={{ fontWeight: 400, fontSize: 24, ...(isMobile ? mobileStyles.row.balance : {}) }}>
                    Balance
                </div>
            </div>
            {loading ? <Loading style={{ left: "50%", transform: "translateX(-50%)", position: "relative" }} /> : list.length ? <>{list}</> : <NoSuchUser />}
            <div className="text-nav" style={isMobile ? { ...mobileStyles.txtNav } : {}}>
                <div className="prev" onClick={goLeft}>
                    Prev.
                </div>
                <div className="next" onClick={goRight}>
                    Next
                </div>
            </div>
        </div>
    );
    //            [{ids.map((i)=>i + ", ")}]
}

const mobileStyles = {
    table: {
        width: "calc(100% - 20px)",
        height: "fit-content",
    },
    row: {
        width: "100%",
        fontSize: "20px",
        balance: {
            width: "33%",
            fontSize: "16px",
        },
        username: {
            width: "50%",
            fontSize: "20px",
        },
        pfp: {
            width: "10%",
            aspectRatio: "1/1",
            //bound the img
            img: {
                width: "100%",
                height: "100%",
                margin: "auto 2px",
            },
        },
    },
    query: {},
    txtNav: {
        position: "relative",
        right: "0px",
        bottom: "0px",
    },
};
