import "../../styles/home.css";

export default function HomePage() {
    return (
        <div className="App">
            <div className="home">
                <div className="title">Betties</div>
                <div className="option-box">
                    <div className="join box">
                        <div className="description">
                            Create, place and wager on live bets with your friends! 
                            Sign up today!
                        </div>
                        <a href="/sign-up">Join!</a>
                    </div>
                </div>
                <div className="features">
                    <div className="feature">
                        <div className="icon">🎲</div>
                        <div className="text">Place bets on live games</div>
                    </div>
                    <div className="feature">
                        <div className="icon">👥</div>
                        <div className="text">Bet with friends</div>
                    </div>
                    <div className="feature">
                        <div className="icon">💰</div>
                        <div className="text">Win big!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
