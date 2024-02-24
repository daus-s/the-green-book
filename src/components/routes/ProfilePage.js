import Header from "../Header";
import Profile from "../Profile";
// replacing this: import { Navigate } from 'react-router-dom';
// with this:
import Perhaps from "./Perhaps";
export default function ProfilePage() {

    return (
        <div>
            
            {sessionStorage.getItem("logged-in")?<><Header /><Profile /></>:<Perhaps />}
        </div>
    );
}