import { useRouter } from "next/router";

export default function SignInToPlace() {
    const router = useRouter();
    return (
        <div className="sign-in" style={{ color: "var(--unimportant-text)", fontSize: "18px", margin: "20px 0px" }}>
            <a href="/login">Login</a> or <a href="/sign-up">sign-up</a> to place bets
            <button
                className="sign-in"
                type="submit"
                onClick={() => {
                    sessionStorage.setItem("breadcrumb", window.location.href);
                    router.push("/login");
                }}
            >
                Log-in
            </button>
        </div>
    );
}
