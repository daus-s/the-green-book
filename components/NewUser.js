import { supabase } from "../functions/SupabaseClient";
import { useEffect, useState } from "react";
import { validEmail, validUsername } from "../functions/isEmail";
import { useAuth } from "./providers/AuthContext";
import { useRouter } from "next/router";
import { useMobile } from "./providers/MobileContext";
import ProfileSelection from "./ProfileSelection";

export default function NewUser() {
    const [userObject, setUserObject] = useState({})

    function append(key, value) {
        // let shallow = {...userObject};
        // shallow[key] = value;
        // setUserObject(shallow);
        setUserObject((prev)=>({...prev, key:value}))
    }


    const [step, setStep] = useState(0);

    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);


    const router = useRouter();
    const { login } = useAuth();
    const { isMobile } = useMobile();

    // useEffect(() => {
    //     setEmailSyntaxError(!validEmail(email) && email !== "");
    //     setUsernameSyntaxError(!validUsername(username) && username !== "");
    // }, [username, email]);

    const insertUser = async ({username, email, password, name}) => {
        const pwd = password;
        
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
        insertUser(userObject);

    };

    let Comp;
    switch(step) {
        case 0:
            Comp = Email;
            break;
        case 1:
            Comp = Username;
            break;
        case 2: 
            Comp = Passwords;
            break;
        case 3:
            Comp = DisplayAndProfile;
            break;
    }
    return (
        <div className="new-user page no-header">
            <img src="/greenbook.jpg" alt="The Green Book logo." className="biglogo" />
            <form onSubmit={handleSubmit} style={isMobile ? mobileStyle.input : {}}>
                <Comp />
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


function PasswordCredentialCheck({ password, confirm }) {
    const length = password?.length >= 6;


    return (
        <div className="password-check" style={{ padding: "10px 0px 0px 0px" }}>
            <div className={"length" + (length ? "good" : "bad")}>
                <img src={length ? "/mark.png" : "/close.png"} style={{ height: "16px", marginRight: "4px" }} />
                The password must be 6 characters.
            </div>
            <div className={"length" + (password===confirm ? "good" : "bad")}>
                <img src={password===confirm ? "/mark.png" : "/close.png"} style={{ height: "16px", marginRight: "4px" }} />
                Passwords must match.
            </div>
        </div>
    );
}



function DisplayAndProfile() {
    const [name, setName] = useState("");

    const { isMobile } = useMobile();

    return (
        <div className="display profile step">
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
            <ProfileSelection />
        </div>
    );
}

function NextStep({inc}) {
    return (
        <div className="">
            Proceed -{">"} 
        </div>
    );
}

function Email({email, setEmail}) {
    const [emailSyntaxError, setEmailSyntaxError] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false);

    const { isMobile } = useMobile();
    return (<div style={{ margin: "10px", display: "flex", flexDirection: "column", ...(isMobile ? mobileStyle.input : {}) }}>
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
    {emailSyntaxError ? <span className="error">Please enter a valid email.</span> : emailExistsError ? <span className="error">Email is already in use.</span> : ""}
</div>);
}

function Username() {
    const [submitted, setSubmitted] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameSyntaxError, setUsernameSyntaxError] = useState(false);


    async function userExists() {
        const usernameExists = await supabase.from("public_users").select().eq("username", username.toLowerCase());

        if (usernameExists.data.length > 0) {
            //error do not proceed
            return true; 
        } else {
return false;        }
    }

    

    const { isMobile } = useMobile();
    return (<div style={{ margin: "10px", display: "flex", flexDirection: "column", ...(isMobile ? mobileStyle.input : {}) }}>
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
                </div>);
}

function Passwords() {
    const [submitted, setSubmitted] = useState(false);
    const [pwd1, setPwd1] = useState("");
    const [pwd2, setPwd2] = useState("");
    const [passwordSyntaxError, setPasswordSyntaxError] = useState(false);
    const [passwordMatchError, setPasswordMatchError] = useState(false);

    const { isMobile } = useMobile();

    useEffect(()=>{
        if (submitted) {
            if (pwd1!==pwd2) {
                setPasswordMatchError(true);
            }
        }
    }, [pwd1, pwd2]);

    return (                
    <div style={{ margin: "10px", display: "flex", flexDirection: "column", ...(isMobile ? mobileStyle.input : {}) }}>
        <label>Password</label>
        {passwordSyntaxError ? <PasswordCredentialCheck password={pwd1} confirm={pwd2}/> : <></>}
        <input
            type="password"
            className="password-field"
            value={pwd1}
            onChange={(e) => {
                setPwd1(e.target.value);
            }}
            style={isMobile ? mobileStyle.input : {}}
            required
        />
        <input
            type="password"
            className="password-field"
            value={pwd2}
            onChange={(e) => {
                setPwd2(e.target.value);
            }}
            style={isMobile ? mobileStyle.input : {}}
            required
        />
    </div>
    );
}