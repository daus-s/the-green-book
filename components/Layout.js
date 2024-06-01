import { useRouter } from "next/router";
import Header from "./Header";
import MobileFooter from "./Sidebar";
import { useMobile } from "./providers/MobileContext";
import Footer from "./Footer";
import TitleWrapper from "./providers/TitleWrapper";

const pageTitleList = {
    "/login": "Login",
    "/attributions": "Attributions",
    "/bets": "Bets",
    "/bookkeeping": "Bookkeeping",
    "/commissioner": "Commissioner",
    "/developers": "Developers",
    "/forgot-password": "Forgot password",
    "/history": "History",
    "/index": "Index",
    "/new-bet": "New bet",
    "/new-group": "New group",
    "/profile": "Profile",
    "/reset-password": "Reset password",
    "/sign-up": "Register",
    "/social": "Social",
    "/thankyou": "Thanks",
    "/wallet": "Wallet",
    "/your-groups": "Your groups",
    "/pga": "PGA Tour",
    "/": "Home",
};

export default function Layout({ children }) {
    const { isMobile } = useMobile();

    //this is turning into bullshit //haha edit 5/31/2024 5:26pm u have no idea
    const router = useRouter();

    const noHeaders = ["/login", "/forgot-password", "/reset-password", "/sign-up", "/rotate"];
    const excludeHeader = noHeaders.includes(router.pathname);
    const main = ["/"].includes(router.pathname);

    return (
        <div className="App">
            <TitleWrapper title={pageTitleList["/" + router.pathname.split("/")[1]]}>
                {!excludeHeader ? <Header nav={!main} /> : <></>}
                {children}
                {isMobile ? <MobileFooter /> : <></>}
                {main ? <Footer /> : <></>}
            </TitleWrapper>
        </div>
    );
}
