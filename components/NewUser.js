import { supabase } from "../functions/SupabaseClient";
import { useEffect, useState } from "react";
import { validEmail, validUsername } from "../functions/isEmail";
import { useAuth } from "./providers/AuthContext";
import { useRouter } from "next/router";
import { useMobile } from "./providers/MobileContext";

export default function NewUser() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [usernameSyntaxError, setUsernameSyntaxError] = useState(false);
    const [emailSyntaxError, setEmailSyntaxError] = useState(false);
    const [passwordSyntaxError, setPasswordSyntaxError] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const router = useRouter();
    const { login } = useAuth();
    const { isMobile } = useMobile();

    useEffect(() => {
        setEmailSyntaxError(!validEmail(email) && email !== "");
        setUsernameSyntaxError(!validUsername(username) && username !== "");
    }, [username, email]);

    const insertUser = async () => {
        const usernameExists = await supabase.from("public_users").select().eq("username", username.toLowerCase());
        const pwd = password;
        if (usernameExists.data.length > 0) {
            //error do not proceed
            setUsernameError(true);
            //setPassword("");
            return;
        } else {
            setUsernameError(false);
        }
        const emailExists = await supabase.rpc("email_from_username", { u: username.toLowerCase() });
        if (emailExists.data) {
            setEmailError(true);
            //setPassword("");
            return;
        } else {
            setEmailError(false);
        }
        const signupResponse = await supabase.auth.signUp({
            email: email.toLowerCase(),
            password: pwd,
        });
        if (signupResponse.error) {
            if (signupResponse.error.message === "User already registered") {
                setEmailError(true);
                return;
            } else if (signupResponse.error.code === "weak_password") {
                setPasswordSyntaxError(true);
                //setPassword("");
                return;
            }
        } else {
            let id = 0;
            while (!id) {
                //this should like never error can count the number of runs later in v4
                const maxInt = Math.pow(2, 31) - 1;
                const tmp = Math.floor(Math.random() * (maxInt + 1));
                const { data, error } = await supabase.from("public_users").select().eq("id", tmp);
                if (!error) {
                    if (data.length) {
                        id = 0;
                    } else {
                        id = tmp;
                    }
                }
            }
            const newUser = {
                userID: signupResponse.data.user.id,
                email: email.toLowerCase(),
                publicID: id,
            };
            const insertResponse = await supabase.from("users").insert(newUser);

            if (!insertResponse.error && signupResponse.data) {
                console.log({
                    name: name,
                    username: username.toLowerCase(),
                });
                const { error } = await supabase
                    .from("public_users")
                    .update({
                        display: name,
                        username: username.toLowerCase(),
                    })
                    .eq("id", id);
                if (!error) {
                    const path = await login(email, pwd);
                    if (path) {
                        router.push(`${path}`);
                    } else {
                        router.push("/bets");
                    }
                }
            }
        }
        //setPassword("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailSyntaxError(!validEmail(email));
        setUsernameSyntaxError(!validUsername(username));
        if ((!emailSyntaxError || validEmail(email)) && (!usernameSyntaxError || validUsername(username))) {
            insertUser();
        }
    };

    return (
        <div className="new-user page no-header">
            <img src="/greenbook.jpg" alt="The Green Book logo." className="biglogo" />
            <form onSubmit={handleSubmit} style={isMobile ? mobileStyle.input : {}}>
                <div style={{ margin: "10px", display: "flex", flexDirection: "column", ...(isMobile ? mobileStyle.input : {}) }}>
                    <label>Email</label>
                    <input
                        type="text"
                        className="email-field"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        style={isMobile ? mobileStyle.input : {}}
                        required
                    ></input>
                    {emailSyntaxError ? <span className="error">Please enter a valid email.</span> : emailError ? <span className="error">Email is already in use.</span> : ""}
                </div>
                <div style={{ margin: "10px", display: "flex", flexDirection: "column", ...(isMobile ? mobileStyle.input : {}) }}>
                    <label>Username </label>
                    <input
                        type="text"
                        className="username-field"
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                        style={isMobile ? mobileStyle.input : {}}
                        required
                    ></input>
                    {usernameSyntaxError ? <span className="error">Please use a alphanumeric username.</span> : usernameError ? <span className="error">Username is already in use.</span> : ""}
                </div>
                <div style={{ margin: "10px", display: "flex", flexDirection: "column", ...(isMobile ? mobileStyle.input : {}) }}>
                    <label>Password</label>
                    <input
                        type="password"
                        className="password-field"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        style={isMobile ? mobileStyle.input : {}}
                        required
                    />
                    {passwordSyntaxError ? <PasswordCredentialCheck password={password} /> : <></>}
                </div>
                <div style={{ margin: "10px", display: "flex", flexDirection: "column", ...(isMobile ? mobileStyle.input : {}) }}>
                    <label>
                        Name <span className="note-span">(This is what other users will see.)</span>
                    </label>
                    <input
                        type="text"
                        className="name-field"
                        style={{ fontSize: "larger", width: "400px", ...(isMobile ? mobileStyle.input : {}) }}
                        onChange={(e) => {
                            setName(e.target.value);
                        }}
                        value={name}
                        required
                    ></input>
                </div>

                <div className="user-pics"></div>
                <button className="create" type="submit">
                    Create Account
                </button>
            </form>
            <a href="/login">Sign In</a>
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

function PasswordCredentialCheck({ password }) {
    const length = password?.length >= 6;

    return (
        <div className="password-check" style={{ padding: "10px 0px 0px 0px" }}>
            <div className={"length" + (length ? "good" : "bad")}>
                <img src={length ? "/mark.png" : "/close.png"} style={{ height: "16px", marginRight: "4px" }} />
                The password must be 6 characters
            </div>
        </div>
    );
}
