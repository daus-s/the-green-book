import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { isLoggedIn } from "../functions/LoginBool";

const ProtectedRoute = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn()) {
            sessionStorage.setItem("breadcrumb", window.location.href);
            router.push("/login");
        }
    }, []);

    return children;
};

export default ProtectedRoute;
