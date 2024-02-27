import Header from "../Header";
import Profile from "../Profile";
// replacing this: import { Navigate } from 'react-router-dom';
// with this:
import Perhaps from "./Perhaps";
import { isLoggedIn } from "../../functions/LoginBool";

export default function ProfilePage() {
    return (
        <div>
            
            {isLoggedIn()?<><Header /><Profile /></>:<Perhaps />}
        </div>
    );
}