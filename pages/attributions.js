import Link from "next/link";
import { useMobile } from "../components/providers/MobileContext";

export default function AttributionPage() {
    return <Attributions />;
}

function Attributions() {
    return (
        <div className="attributions page">
            <Attribution src="mark.png" href="https://www.flaticon.com/free-icons/good" desc="Good icons created by Alfredo Creates - Flaticon" />
            <Attribution src="close.png" href="https://www.flaticon.com/free-icons/close" desc="Close icons created by Alfredo Hernandez - Flaticon" />
            <Attribution src="add.png" href="https://www.flaticon.com/free-icons/plus" desc="Plus icons created by dmitri13 - Flaticon" />
            <Attribution src="insert.png" href="https://www.flaticon.com/free-icons/plus" desc="Plus icons created by dmitri13 - Flaticon" />
            <Attribution src="accept.png" href="https://www.flaticon.com/free-icons/plus" desc="Plus icons created by dmitri13 - Flaticon" />
            <Attribution src="star.png" href="https://www.flaticon.com/free-icons/recommend" desc="Recommend icons created by wahya - Flaticon" />
            <Attribution src="money.png" href="https://www.flaticon.com/free-icons/coin" desc="Coin icons created by Gregor Cresnar - Flaticon" />
            <Attribution src="remove.png" href="https://www.flaticon.com/free-icons/remove" desc="Remove icons created by Royyan Wijaya - Flaticon" />
            <Attribution src="lock.png" href="https://www.flaticon.com/free-icons/password" desc="Password icons created by Pixel perfect - Flaticon" />
            <Attribution src="submit.png" href="https://www.flaticon.com/free-icons/submit" desc="Submit icons created by Depot Visual - Flaticon" />
            <Attribution src="user.png" href="https://www.flaticon.com/free-icons/user" desc="User icons created by Becris - Flaticon" />
            <Attribution src="write.png" href="https://www.flaticon.com/free-icons/edit" desc="Edit icons created by Kiranshastry - Flaticon" />
            <Attribution src="search.png" href="https://www.flaticon.com/free-icons/search" desc="Search icons created by Catalin Fertu - Flaticon" />
            <Attribution src="trash.png" href="https://www.flaticon.com/free-icons/delete" desc="Delete icons created by Kiranshastry - Flaticon" />
            <Attribution src="x.png" href="https://www.flaticon.com/free-icons/close" desc="Close icons created by ariefstudio - Flaticon" />
            <Attribution src="left.png" href="https://www.flaticon.com/free-icons/next" desc="Next icons created by Roundicons - Flaticon" />
            <Attribution src="right.png" href="https://www.flaticon.com/free-icons/next" desc="Next icons created by Roundicons - Flaticon" />
            <Attribution src="shield.png" href="https://www.flaticon.com/free-icons/emblem" desc="Emblem icons created by Smashicons - Flaticon" />
            <Attribution src="menu.png" href="https://www.flaticon.com/free-icons/hamburger" desc="Hamburger icons created by feen - Flaticon" />
            <Attribution src="social.png" href="https://www.flaticon.com/free-icons/networking" desc="Networking icons created by Becris - Flaticon" backgroundColor="var(--soft-highlight)" />
            <Attribution src="history.png" href="https://www.flaticon.com/free-icons/chart" desc="Chart icons created by Kiranshastry - Flaticon" backgroundColor="var(--soft-highlight)" />
            <Attribution src="balance.png" href="https://www.flaticon.com/free-icons/price" desc="Price icons created by bqlqn - Flaticon" backgroundColor="var(--soft-highlight)" />
            <Attribution src="bet.png" href="https://www.flaticon.com/free-icons/insert" desc="Insert icons created by Iconjam - Flaticon" backgroundColor="var(--soft-highlight)" />
            <Attribution
                src="bookkeeping.png"
                href="https://www.flaticon.com/free-icons/bookkeeping"
                desc="Bookkeeping icons created by smashingstocks - Flaticon"
                backgroundColor="var(--soft-highlight)"
            />
            <Attribution src="groupsettings.png" href="https://www.flaticon.com/free-icons/profile" desc="Profile icons created by Pixel perfect - Flaticon" backgroundColor="var(--soft-highlight)" />
            <Attribution src="creategroup.png" href="https://www.flaticon.com/free-icons/members" desc="Members icons created by GOFOX - Flaticon" backgroundColor="var(--soft-highlight)" />
            <Attribution src="newbet.png" href="https://www.flaticon.com/free-icons/exam" desc="Exam icons created by RIkas Dzihab - Flaticon" backgroundColor="var(--soft-highlight)" />
            <Attribution src="login.png" href="https://www.flaticon.com/free-icons/register" desc="Register icons created by See Icons - Flaticon" />
            <Attribution src="arrow.png" href="https://www.flaticon.com/free-icons/down-arrow" desc="Down arrow icons created by th studio - Flaticon" />
            <Attribution src="save.png" href="https://www.flaticon.com/free-icons/floppy-disk" desc="Floppy disk icons created by Rizki Ahmad Fauzi - Flaticon" />
            <Attribution src="/view.png" href="https://www.flaticon.com/free-icons/eye" desc="Eye icons created by torskaya - Flaticon" />
            <Attribution src="/hidden.png" href="https://www.flaticon.com/free-icons/eye-password" desc="Eye password icons created by mattbadal - Flaticon" />
        </div>
    );
}

function Attribution({ href, desc, src, backgroundColor }) {
    const { isMobile } = useMobile();

    return isMobile ? (
        <div className="attribution mobile">
            <Link href={href}>
                <img src={"/" + src} style={{ height: "32px", backgroundColor: backgroundColor ? backgroundColor : "transparent" }} />
                <div className="title">{src}</div>
            </Link>
        </div>
    ) : (
        <div className="attribution">
            <Link href={href}>
                <div className="title">{src}</div>
                <div className="data">
                    <img src={src} style={{ height: "50px", backgroundColor: backgroundColor ? backgroundColor : "transparent" }} />
                    {desc}
                </div>
            </Link>
        </div>
    );
}
