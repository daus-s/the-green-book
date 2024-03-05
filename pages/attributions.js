import Link from "next/link";
import Header from "../components/Header";

export default function AttributionPage() {
    return (
        <div className="App" style={{paddingTop: '96px'}}>
            <Header />
            <Attributions />
        </div>
    );
}

function Attributions() {
    return (
        <div className="attributions page">
            <Attribution src='mark.png' href='https://www.flaticon.com/free-icons/good' desc='Good icons created by Alfredo Creates - Flaticon'/>
            <Attribution src='close.png' href='https://www.flaticon.com/free-icons/close' desc='Close icons created by Alfredo Hernandez - Flaticon'/>
            <Attribution src='add.png' href='https://www.flaticon.com/free-icons/plus' desc='Plus icons created by dmitri13 - Flaticon'/>
            <Attribution src='insert.png' href='https://www.flaticon.com/free-icons/plus' desc='Plus icons created by dmitri13 - Flaticon'/>
            <Attribution src='accept.png' href='https://www.flaticon.com/free-icons/plus' desc='Plus icons created by dmitri13 - Flaticon'/>
            <Attribution src='star.png' href='https://www.flaticon.com/free-icons/recommend' desc='Recommend icons created by wahya - Flaticon'/>
            <Attribution src='money.png' href='https://www.flaticon.com/free-icons/coin' desc='Coin icons created by Gregor Cresnar - Flaticon'/>
            <Attribution src='remove.png' href='https://www.flaticon.com/free-icons/remove' desc='Remove icons created by Royyan Wijaya - Flaticon'/>
            <Attribution src='lock.png' href='https://www.flaticon.com/free-icons/password' desc='Password icons created by Pixel perfect - Flaticon'/>
            <Attribution src='submit.png' href='https://www.flaticon.com/free-icons/submit' desc='Submit icons created by Depot Visual - Flaticon'/>
            <Attribution src='user.png' href='https://www.flaticon.com/free-icons/user' desc='User icons created by Becris - Flaticon'/>
            <Attribution src='write.png' href='https://www.flaticon.com/free-icons/edit' desc='Edit icons created by Kiranshastry - Flaticon'/>
            <Attribution src='verify.png' href='https://www.flaticon.com/free-icons/verified' desc='Verified icons created by Rizki Ahmad Fauzi - Flaticon'/>
            <Attribution src='search.png' href='https://www.flaticon.com/free-icons/search' desc='Search icons created by Catalin Fertu - Flaticon'/>
            <Attribution src='trash.png' href='https://www.flaticon.com/free-icons/delete' desc='Delete icons created by Kiranshastry - Flaticon'/>
            <Attribution src='x.png' href='https://www.flaticon.com/free-icons/close' desc='Close icons created by ariefstudio - Flaticon'/>
            <Attribution src='left.png' href='https://www.flaticon.com/free-icons/next' desc='Next icons created by Roundicons - Flaticon'/>
            <Attribution src='right.png' href='https://www.flaticon.com/free-icons/next' desc='Next icons created by Roundicons - Flaticon'/>
            <Attribution src='shield.png' href='https://www.flaticon.com/free-icons/emblem' desc='Emblem icons created by Smashicons - Flaticon'/>
        </div>
    );
}

function Attribution({href, desc, src}) {
    return (
        <div className="attribution">
            <div className="title">{src}</div>
            <div className="data">
                <img src={src} style={{height: '50px'}}/>
                <Link href={href}> {desc}</Link>
            </div>
        </div>
    )
}