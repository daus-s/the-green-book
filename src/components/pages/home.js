import React from 'react';
import { Link } from 'react-router-dom';
import "../../styles/home.css";
import AccountControl from '../AccountControl';

export default function HomePage() {
    return (
    <div className="home">
        <div className='page-header'>
            <div className='flashy'>
                <img src="greenbook.jpg" alt={"The Green Book logo."} className="biglogo"/>
                <div className='text'>
                    <div className="title">theGreenBook</div>
                    <div className='authored'>betties.app</div>
                </div>
            </div>
            <div className='mage-blender'>
                <img src='the-book.jpg'/>
            </div>
            <div className="description">
                theGreenBook, a social betting app paying homage to its humble beginnings as a green notebook shared by some friends
            </div>
            <div className='acct-ctrl'>
                <AccountControl />
            </div>
        </div>
            <div className="options">
                <Link to="/sign-up" className="option">
                    <div className="card">
                        <div className="card-content">
                            <div className="card-title">Join Now</div>
                            <div className="card-description">Create a new account and become a commissioner!</div>
                        </div>
                    </div>
                </Link>
                <Link to="/social" className="option">
                    <div className="card">
                        <div className="card-content">
                            <div className="card-title">Find Your Squad</div>
                            <div className="card-description">Join an existing group created by your friend.</div>
                        </div>
                    </div>
                </Link>
                <Link to="/bets" className="option">
                    <div className="card">
                        <div className="card-content">
                            <div className="card-title">Win Tokens!</div>
                            <div className="card-description">Keep a standing balance and earn profits from bets you win!</div>
                        </div>
                    </div>
                </Link>
            </div>
        <footer className='footer'>
            <div className='note'>
                <a href="/developers">Developers</a>
            </div>
            <div className='note'>
                <a href="/attributions">Attributions</a>
            </div>
            <div className='note'>
                <a href='/ty<3'>Special Thanks</a>
            </div>
            <div className='note'>
                <a href="https://github.com/daus-s/the-green-book/issues">Report an issue</a>
            </div>
        </footer>
    </div>
    );
};
        