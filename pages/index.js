import React from "react";
import TreeMenu from "../components/TreeMenu";
import PGA from "../components/PGAIcon";

export default function HomePage() {
    return (
        <div className="home page" style={{ overflowY: "auto", overflowX: "hidden" }}>
            <PGA style={{ gridRow: "1 / 3", gridColumn: "1 / 2" }} display />
            <TreeMenu />
        </div>
    );
}
