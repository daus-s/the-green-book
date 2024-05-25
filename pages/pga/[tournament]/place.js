import { useRouter } from "next/router";
import MastersPlaceBetForm from "../../../components/MastersBetPlaceForm";
import ProtectedRoute from "../../_ProtectedRoute";

export default function MastersPlaceBetPage() {
    const router = useRouter();

    return (
        <ProtectedRoute>
            <div className="masters page">
                <a className="return" href={"/pga/" + router.query.tournament}>
                    {"<"} Return to tournament dashboard
                </a>
                <MastersPlaceBetForm />
            </div>
        </ProtectedRoute>
    );
}
