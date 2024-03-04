import { useState } from "react";

import "../styles/passwords.css";
import { supabase } from "../functions/SupabaseClient";
import { useRouter } from "next/router";


export default function ResetPassword() {
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const [error, setError] = useState(false);

    const router = useRouter();

    
    const handleChange1 = (e) => {
        setPassword1(e.target.value);
    }
    const handleChange2 = (e) => {
        setPassword2(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password1 == password2) {
            const { data, error } = await supabase.auth.updateUser({ password: password1 });
            if (data) router.push("/");
            if (error) setError(true); 
        }
        else {
            setError(true);
        }
    };

    return (
        <div className="reset-password page">
            <img src="greenbook.jpg" alt={"The Green Book logo."} className="biglogo"/>
            <form className="reset-password-form" onSubmit={(e)=>handleSubmit(e)}>
                <div className="pwd">
                    <label>Password</label>
                    <input type="password" value={password1} onChange={(e)=>handleChange1(e)}/>
                </div>
                <div className="pwd">
                    <label>Confirm Password</label>
                    <input type="password" value={password2} onChange={(e)=>handleChange2(e)}/>
                </div>
                <button className="update-password" type="submit">
                    Update
                </button>
            </form>
        </div>
    );
}