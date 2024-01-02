import "../styles/header.css";

export default function Header() {
  return (
    <header>
      <div className="logo">
        <img src="greenbook.jpg" alt="Logo" />
        <div id="wordtitles">
          <h1>The Greenbook</h1>
          <h6>digitized</h6>
        </div>
      </div>
      <nav>
        <a href="/bets">Your Bets</a>
        <a href="#">Bets Placed</a>
        <a href="/wallet">Balance</a>
        <a href="#">Security</a>
      </nav>
      <button className="cta-button" onClick={()=>window.location.href='/login'}>Sign In</button>
    </header>
  );
}
