import { useMobile } from "./providers/MobileContext";

export default function Logo() {
    const { isMobile } = useMobile();

    return (
        <div className="logo" onClick={() => (window.location.href = "/")} style={{ cursor: "pointer" }}>
            <img className={isMobile ? "mobile" : ""} src="/greenbook.jpg" alt="Logo" style={{ borderRadius: "50%" }} />
            <div id="wordtitles">
                <h1 className={isMobile ? "mobile" : ""}>betties.app</h1>
                <h6 className={isMobile ? "mobile" : ""}>Greenbook - digitized</h6>
            </div>
        </div>
    );
}

//28, 10 -> 50
// 38 -> 50
// f*1.315 = 50 | f=38

// f -> 70
// 70/1.315=
// 53,
// sep(f) {
//    10/38*f
//    28/38*f
// }
