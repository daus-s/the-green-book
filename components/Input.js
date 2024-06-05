import { Password } from "@mui/icons-material";
import { useState } from "react";

export default function Input({ value, setValue, className, type, placeholder, onBlur, required }) {
    const [viewPwd, setViewPwd] = useState(type === "password" ? false : true);
    if (typeof value !== "string" || typeof setValue !== "function") {
        let message = "Input Component called incorrectly:\n";
        if (typeof value !== "string") {
            message += "  • expected value to be of type <string>\n    got " + typeof value + " instead";
        }
        if (typeof setValue !== "function") {
            message += "  • expected value to be of type <function>\n    got " + typeof setValue + " instead";
        }
        throw new Error(message);
    }

    return (
        <div className={(className ? className : "") + (value.length ? " filled" : "")} onBlur={onBlur}>
            <input
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                type={type && !viewPwd ? type : ""}
                required={required}
            />
            {type === "password" ? (
                <img
                    className={"viewpwd" + (viewPwd ? " active" : "")}
                    src="/view.png"
                    onClick={() => {
                        setViewPwd((prev) => !prev);
                    }}
                />
            ) : (
                <></>
            )}
            <div className="placeholder">{placeholder ? placeholder : ""}</div>
        </div>
    );
}
