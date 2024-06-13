import { supabase } from "../functions/SupabaseClient";
import { useEffect, useState } from "react";
import { validEmail, validUsername } from "../functions/isEmail";
import { useAuth } from "./providers/AuthContext";
import { useRouter } from "next/router";
import { useMobile } from "./providers/MobileContext";
import ProfileSelection from "./ProfileSelection";
import Input from "./Input";
import Image from "next/image";

export default function NewUser() {
    const [step, setStep] = useState("auth");
    const [path, setPath] = useState("/bets");

    useEffect(() => {}, []);

    const { isMobile } = useMobile();
    const router = useRouter();

    const inc = () => {
        switch (step) {
            case "auth":
                setStep("display");
                break;
            case "display":
                setStep("pfp");
                break;
            case "pfp":
                if (path) {
                    router.push(`${path}`);
                } else {
                    router.push("/bets");
                }
                break;
        }
    };

    return (
        <div className="new-user page no-header" style={isMobile ? { paddingBottom: "0px", transform: "translateY(10px)" } : {}}>
            {!isMobile ? <img src="/greenbook.jpg" alt="The Green Book logo." className="biglogo" /> : <></>}
            {step === "auth" ? <Credentials inc={inc} setPath={setPath} /> : <></>}
            {step === "display" ? <Display inc={inc} /> : <></>}
            {step === "pfp" ? <Profile inc={inc} /> : <></>}
            {step === "auth" ? (
                <span>
                    Already have an account?
                    <a href="/login">Sign In</a>
                </span>
            ) : (
                <></>
            )}
        </div>
    );
}

const mobileStyle = {
    form: {
        width: "calc(100% - 16px)",
    },
    input: {
        maxWidth: "100%",
        width: "calc(100% - 16px)",
    },
};

function Credentials({ inc, setPath }) {
    const [username, setUsername] = useState("");
    const [u3, setU3] = useState(false); //email exists
    const [u1, setU1] = useState(false); //emaily syntax

    const [email, setEmail] = useState("");
    const [e3, setE3] = useState(false); //email exists error
    const [e1, setE1] = useState(false); //email syntax error

    const [password, setPassword] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");

    const { isMobile } = useMobile();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!e1 && !e3 && !u1 && !u3) {
            insertUser({ username, password, email });
        }
    };

    useEffect(() => {
        if (username) {
            checkUsername();
        }
    }, [username]);

    useEffect(() => {
        checkEmail();
    }, [email]);

    const checkUsernameExists = async () => {
        if (username) {
            const { data: exists, error } = await supabase.from("public_users").select().eq("username", username);
            if (!error && exists.length) {
                setU3(true);
            } else {
                setU3(false);
            }
        }
    };

    const checkUsernameSyntax = () => {
        if (username) {
            setU1(!validUsername(username));
        }
    };

    const checkUsername = () => {
        checkUsernameSyntax();
        checkUsernameExists();
    };

    const checkEmailSyntax = async () => {
        if (email) {
            setE1(!validEmail(email));
        }
    };
    const checkEmailExists = async () => {
        if (email && validEmail(email)) {
            const { data: exists, error } = await supabase.rpc("email_exists", { email: email });
            setE3(!error && exists ? true : false);
        }
    };

    const checkEmail = () => {
        checkEmailSyntax();
        checkEmailExists();
    };

    const insertUser = async ({ username, email, password }) => {
        const pwd = password;

        const emailExists = await supabase.rpc("email_from_username", { u: username.toLowerCase() });
        if (emailExists.data) {
            setE3(true);
            return;
        } else {
            setE3(false);
        }

        const signupResponse = await supabase.auth.signUp({
            email: email.toLowerCase(),
            password: pwd,
        });

        if (signupResponse.error) {
            if (signupResponse.error.message === "User already registered") {
                setE3(true);
                return;
            } else if (signupResponse.error.code === "weak_password") {
                setE1(true);
                return;
            }
        }

        let id = 0;
        while (!id) {
            //this should like never error can count the number of runs later in v4
            const maxInt = Math.pow(2, 31) - 1;
            const tmp = Math.floor(Math.random() * (maxInt + 1));
            const { data, error } = await supabase.from("public_users").select().eq("id", tmp);
            if (error) {
                return;
            }
            if (data.length) {
                id = 0;
            } else {
                id = tmp;
            }
        }

        const newUser = {
            userID: signupResponse.data.user.id,
            email: email.toLowerCase(),
            publicID: id,
        };
        const insertResponse = await supabase.from("users").insert(newUser);

        if (insertResponse.error) {
            return;
        }

        const { data: ireq, error: ireqErr } = await supabase.from("users").select("publicID").eq("email", email).single();

        if (ireqErr) {
            return;
        }

        await supabase
            .from("public_users")
            .update({
                username: username,
            })
            .eq("id", ireq);

        const path = await login(email, pwd);
        if (path) {
            setPath(path);
        }

        inc();
        setPassword("");
        setConfirmPwd("");
    };

    return (
        <form className="register-form credentials" onSubmit={handleSubmit} style={isMobile ? mobileStyle.input : {}}>
            <h1>Create account</h1>
            <Input className="username" value={username} setValue={setUsername} placeholder="Username" onBlur={checkUsername} />
            <UsernameCredentialCheck syntax={u1} exists={u3} />
            <Input className="email" value={email} setValue={setEmail} placeholder="Email" onBlur={checkEmail} />
            <EmailCredentialCheck syntax={e1} exists={e3} />
            <Input className="password" value={password} setValue={setPassword} placeholder="Password" type="password" />
            <Input className="confirm" value={confirmPwd} setValue={setConfirmPwd} placeholder="Confirm password" type="password" />
            {password && confirmPwd ? <PasswordCredentialCheck password={password} confirm={confirmPwd} /> : <></>}
            <button className="create" type="submit" disabled={e1 || e3 || u1 || u3 || !(password.length >= 8 && password === confirmPwd)}>
                Create Account
            </button>
        </form>
    );
}

function PasswordCredentialCheck({ password, confirm }) {
    const length = password?.length >= 8;

    if (!length || password !== confirm) {
        return (
            <div className="password check" style={{ padding: "5px 0px 5px 0px" }}>
                <div className={"length " + (length ? "good" : "bad")}>
                    <img src={length ? "/mark.png" : "/close.png"} style={{ height: "16px", marginRight: "4px", width: "auto" }} />
                    The password must be at least 8 characters.
                </div>
                <div className={"length " + (password === confirm ? "good" : "bad")}>
                    <img src={password === confirm ? "/mark.png" : "/close.png"} style={{ height: "16px", marginRight: "4px", width: "auto" }} />
                    Passwords must match.
                </div>
            </div>
        );
    } else {
        return <></>;
    }
}

function Profile({ inc }) {
    const [pfp, setPFP] = useState("");
    const { meta, updateMeta } = useAuth();

    const handleSnap = async () => {
        if (!meta?.id) {
            return;
        }
        const { error: updatePFP } = await supabase
            .from("public_users")
            .update({
                pfp_url: pfp,
            })
            .eq("id", meta.id);
        const success = !updatePFP;
        if (success) {
            await updateMeta();
            inc();
        }
    };

    return (
        <div className="profile">
            <span style={{ color: "var(--title)", fontSize: "28px", textAlign: "left" }}>Choose your profile picture</span>
            <ProfileSelection close={() => {}} updateValue={setPFP} />
            <button
                onClick={handleSnap}
                style={{ height: "fit-content", width: "fit-content", backgroundColor: "transparent", border: "none", outline: "none", marginLeft: "auto", marginRight: "14px" }}
            >
                <Image className="continue" width={100} height={100} src="/greenarrow.png" />
            </button>
        </div>
    );
}

function Display({ inc }) {
    const [dn, setDN] = useState("");
    const { meta, updateMeta } = useAuth();

    const handleDisplayUpdate = async () => {
        if (!meta?.id) {
            return;
        }
        const { error: updateDisplay } = await supabase.from("public_users").update({ display: dn }).eq("id", meta.id);
        if (!updateDisplay) {
            await updateMeta();
            inc();
        }
    };

    return (
        <div className="display">
            <input value={dn} onChange={(e) => setDN(e.target.value)} placeholder="Display name" />
            <span style={{ color: "var(--title)", fontSize: "16px", textAlign: "left" }}>(this is what other users will see)</span>
            <button
                onClick={handleDisplayUpdate}
                style={{ height: "fit-content", width: "fit-content", backgroundColor: "transparent", border: "none", outline: "none", marginLeft: "auto", marginRight: "14px" }}
            >
                <Image className="continue" width={100} height={100} src="/greenarrow.png" />
            </button>
        </div>
    );
}

function EmailCredentialCheck({ exists, syntax }) {
    if (exists || syntax) {
        return (
            <div className="email check" style={{ padding: "5px 0px 5px 0px" }}>
                {syntax ? (
                    <div className="syntax">
                        <img src={!syntax ? "/mark.png" : "/close.png"} style={{ height: "16px", marginRight: "4px", width: "auto" }} />
                        Please enter a valid email.
                    </div>
                ) : (
                    <></>
                )}
                {exists ? (
                    <div className="exists">
                        <img src={!exists ? "/mark.png" : "/close.png"} style={{ height: "16px", marginRight: "4px", width: "auto" }} />
                        Email is already associated with an account.
                    </div>
                ) : (
                    <></>
                )}
            </div>
        );
    } else {
        return <></>;
    }
}

function UsernameCredentialCheck({ exists, syntax }) {
    if (exists || syntax) {
        return (
            <div className="username check" style={{ padding: "5px 0px 5px 0px" }}>
                {syntax ? (
                    <div className="syntax">
                        <img src={!syntax ? "/mark.png" : "/close.png"} style={{ height: "16px", marginRight: "4px", width: "auto" }} />
                        Usernames must be only letters and numbers.
                    </div>
                ) : (
                    <></>
                )}
                {exists ? (
                    <div className="exists">
                        <img src={!exists ? "/mark.png" : "/close.png"} style={{ height: "16px", marginRight: "4px", width: "auto" }} />
                        Username is already associated with an account.
                    </div>
                ) : (
                    <></>
                )}
            </div>
        );
    } else {
        return <></>;
    }
}
