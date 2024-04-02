import { useEffect } from "react";
import Admin from "../components/Admin";
import ProtectedRoute from "./_ProtectedRoute";

export default function AdminPage() {
    useEffect(()=> {

    }, [])
    return (
        <ProtectedRoute>
            <Admin/>
        </ProtectedRoute>
    );
}