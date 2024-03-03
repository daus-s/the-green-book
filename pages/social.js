import Header from "../Header";
import Social from "../Social";
import { Navigate } from 'react-router-dom';
import { isLoggedIn } from "../../functions/LoginBool";

export default function SocialPage() {
    return (
        <div className="App">
            <Header />
            {isLoggedIn()?<Social />:<Navigate to="/login"/>}
        </div>
    );
}