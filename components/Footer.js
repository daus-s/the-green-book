import { useMobile } from "./providers/MobileContext";

export default function Footer() {
    const {isMobile, height, width}= useMobile();

    return (
        <footer className='footer' style={isMobile?{marginTop: 0}:{}}>
            <div className='note' style={isMobile?{fontSize: '11px'}:{}}>
                <a href="/developers">Developers</a>
            </div>
            <div className='note' style={isMobile?{fontSize: '11px'}:{}}>
                <a href="/attributions">Attributions</a>
            </div>
            <div className='note' style={isMobile?{fontSize: '11px'}:{}}>
                <a href='/ty<3'>Special Thanks</a>
            </div>
            <div className='note' style={isMobile?{fontSize: '11px'}:{}}>
                <a href="https://github.com/daus-s/the-green-book/issues">Report an issue</a>
            </div>
        </footer>
    );
}