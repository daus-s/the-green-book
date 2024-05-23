import Link from "next/link";

export default function PGA({ linkstyle, display }) {
    return (
        <Link className="pga-icon" href="/pga" style={linkstyle}>
            <img src="/pga.png" style={{ height: "220px", margin: "5px 20px" }} />
            {display ? <></> : <span>{"<"} Return to PGA dashboard</span>}
        </Link>
    );
}
