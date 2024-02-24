import "../styles/header.css";
/*





*/
export default function Logo() {
    return (
        <div className="logo">
                <img src="greenbook.jpg" alt="Logo" style={{borderRadius:"50%"}}/>
                <div id="wordtitles" onClick={()=>window.location.href="/"}>
                <h1>Betties.app</h1>
                <h6>Greenbook - digitized</h6>
            </div>
        </div>
    );
}