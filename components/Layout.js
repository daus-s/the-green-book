import Header from "./Header";
import MobileFooter from "./MobileFooter";
import { useMobile } from "./providers/MobileContext";

export default function Layout({ children }) {
    const { isMobile } = useMobile();

    return (
        <div className="App">
            <Header />
            {children}
            {isMobile && <MobileFooter />}
        </div>
    );
}