import { useRouter } from "next/router";
import Header from "./Header";
import MobileFooter from "./Sidebar";
import { useMobile } from "./providers/MobileContext";

export default function Layout({ children }) {
    const { isMobile } = useMobile();

    //this is turning into bullshit
    const router = useRouter();

    const noHeaders = ['/login', '/', '/forgot-password', '/reset-password', '/sign-up', '/rotate'];
    const excludeHeader = noHeaders.includes(router.pathname);

    return (
        <div className="App">
            {!excludeHeader ? <Header /> : <></>}
            {children}
            {isMobile ? <MobileFooter /> : <></>}
        </div>
    );

}