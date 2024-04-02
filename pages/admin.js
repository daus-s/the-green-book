import Admin from "../components/Admin";
import AdminGuard from "./_Admin";

export default function AdminPage() {
    return (
        <AdminGuard>
            <Admin/>
        </AdminGuard>
    );
}