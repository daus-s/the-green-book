import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAuth } from "../components/providers/AuthContext";
import { supabase } from "../functions/SupabaseClient";
import Loading from "../components/Loading";

const AdminGuard = ({ children }) => {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAdmin = async () => {
            if (user) {
                const { data, error } = await supabase.from("users").select("admin").eq("userID", user.id).single();
                return data.admin;
            } else {
                setLoading(true);
            }
        };

        const doReRoute = async () => {
            if (user) {
                if (!(await checkAdmin())) {
                    // console.log(`${user.email} tried to access secure components`)
                    router.push("/");
                } else {
                    setLoading(false);
                }
            } else {
                setLoading(true);
            }
        };

        doReRoute();
    }, [user]);

    if (loading) {
        return <Loading />;
    } else {
        return children;
    }
};

export default AdminGuard;
