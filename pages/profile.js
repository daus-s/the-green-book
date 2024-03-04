import Header from "../components/Header";
import Profile from "../components/Profile";
// replacing this: import { Navigate } from 'react-router-dom';
// with this:
import Perhaps from "../components/Perhaps";
import { isLoggedIn } from "../functions/LoginBool";

export default function ProfilePage() {
    return (
        <div>
            
            {isLoggedIn()?<><Header /><Profile /></>:<Perhaps />}
        </div>
    );
}