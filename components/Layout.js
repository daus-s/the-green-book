import { useRouter } from "next/router";
import Header from "./Header";
import MobileFooter from "./MobileFooter";
import { useMobile } from "./providers/MobileContext";

export default function Layout({ children }) {
    const { isMobile } = useMobile();

    //this is turning into bullshit
    const router = useRouter();

    const noHeaders = ['/login', '/', '/forgot-password', '/reset-password', '/sign-up'];
    const excludeHeader = noHeaders.includes(router.pathname);

    return (
        <div className="App">
            {!excludeHeader && <Header />}
            {children}
            {isMobile && <MobileFooter />}
        </div>
    );

}