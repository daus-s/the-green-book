import AccountControl from "./AccountControl";
import Logo from "./Logo";

/* * 
    Source: 
    https://bobbyhadz.com/blog/react-insert-gif
 */
export default function Perhaps() {

    const styles = {
        marginTop: '96px',
        width: '498px',
        height: '368px',
    }
    return (
        <div className="App">
            <header>
                <Logo />
                <AccountControl />
            </header>
            <img src="family-guy-peter-griffin.gif" alt="my-gif" style={styles} />
        </div>
    );
}



