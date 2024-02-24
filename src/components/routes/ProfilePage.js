import Header from "../Header";
import Profile from "../Profile";
// replacing this: import { Navigate } from 'react-router-dom';
// with this:
import Perhaps from "./Perhaps";
import { isLoggedIn } from "../../functions/LoginBool";

export default function ProfilePage() {

    if (isLoggedIn()) {
        console.log('truthy');
        console.log(isLoggedIn());
    }
    return (
        <div>
            
            {isLoggedIn()?<><Header /><Profile /></>:<Perhaps />}
        </div>
    );
}