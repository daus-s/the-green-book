"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./providers/AuthContext";
import { useMobile } from "./providers/MobileContext";
import Input from "./Input";
import { f } from "../functions/f.js";

export default function Auth() {
    const { login } = useAuth();
    const [usr, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [invalid, setInvalid] = useState(false);

    const router = useRouter();
    const { isMobile } = useMobile();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const path = await login(usr, f(password));
            if (path) {
                router.push(`${path}`);
            } else {
                router.push("/bets");
            }
        } catch (error) {
            setInvalid(true);
            setPassword("");
        }
    };
    //supabase cnx
    return (
        <div className="auth-login page">
            <img
                src="/greenbook.jpg"
                alt={"The Green Book logo."}
                className="biglogo"
            />
            <form
                onSubmit={handleLogin}
                style={isMobile ? mobileStyle.form : { width: "375px" }}
            >
                <Input
                    className="username"
                    value={usr}
                    setValue={setUser}
                    placeholder="Username"
                />

                <Input
                    className="password"
                    value={password}
                    setValue={setPassword}
                    placeholder="Password"
                    type="password"
                />
                {invalid ? (
                    <span className="error">
                        <b>Error: </b>Incorrect username or password
                    </span>
                ) : (
                    <br />
                )}
                <button className="signin" type="submit">
                    Log-in
                </button>
            </form>
            <div className="link-box">
                <a href="/register">Create an Account</a>
                <a className="forgot-password" href="/forgot-password">
                    Forgot your password?
                </a>
            </div>
        </div>
    );
}

const mobileStyle = {
    form: {
        width: "calc(100% - 16px)"
    },
    input: {
        maxWidth: "100%",
        width: "calc(100% - 16px)"
    }
};
