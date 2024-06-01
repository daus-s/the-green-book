import React, { useEffect, useState } from "react";
import TreeMenu from "../components/TreeMenu";
import PGA from "../components/PGAIcon";
import { useMobile } from "../components/providers/MobileContext";

export default function HomePage() {
    const { isMobile } = useMobile();

    const [affirmativeConsent, setAffirmativeConsent] = useState(false);

    useEffect(() => {
        if (!isMobile && typeof isMobile === "boolean") {
            setAffirmativeConsent(true);
        } else {
            setAffirmativeConsent(false);
        }
    }, [isMobile]);

    return (
        <div className="home page" style={{ overflowY: "auto", overflowX: "hidden" }}>
            {affirmativeConsent ? <PGA style={{ gridRow: "1 / 3", gridColumn: "1 / 2" }} display /> : <></>}
            <TreeMenu />
        </div>
    );
}
