export default function Logo() {
    return (
        <div className="logo" onClick={()=>window.location.href="/"} style={{cursor: 'pointer'}}>
                <img src="greenbook.jpg" alt="Logo" style={{borderRadius:"50%"}}/>
                <div id="wordtitles" >
                <h1>Betties.app</h1>
                <h6>Greenbook - digitized</h6>
            </div>
        </div>
    );
}