import { useState } from "react";
import { validEmail } from "../functions/isEmail";
import { supabase } from "../functions/SupabaseClient";

import "../styles/passwords.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);


    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const sendResetEmail = async (e) => {
        e.preventDefault();
        if (validEmail(email)) {
            await supabase.auth.resetPasswordForEmail(email);
            setEmail("");
            setError(false);
            setSuccess(true);
        } else {
            setError(true);
            setSuccess(false);
        }
    };

    return (
        <div className="forgot-password page">
            <img src="greenbook.jpg" alt={"The Green Book logo."} className="biglogo"/>
            <form className="forgot-password-form" onSubmit={(e)=>{sendResetEmail(e)}}>
                <div className="input">
                    <label>Email</label>
                    <input className="email-input" value={email} onChange={(e)=>handleChange(e)}/>
                </div>
                {error?<i className="error">Not a valid email address.</i>:""}
                {success?<i>If there is an account registered to this email there will be an email sent shortly.</i>:""}
                <button className="forgot-via-email" type="submit">
                    Submit
                </button>
            </form>
        </div>
    );
}