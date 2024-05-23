import { useRouter } from "next/router";
import MastersPlaceBetForm from "../../../components/MastersBetPlaceForm";

export default function MastersPlaceBetPage() {
    const router = useRouter();

    return (
        <div className="masters page">
            <a className="return" href={"/pga/" + router.query.tournament}>
                {"<"} Return to tournament dashboard
            </a>
            <MastersPlaceBetForm />
        </div>
    );
}
