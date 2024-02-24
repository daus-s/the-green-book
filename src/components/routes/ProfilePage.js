import Header from "../Header";
import Profile from "../Profile";
import { Navigate } from 'react-router-dom';
export default function ProfilePage() {
    return (
        <div>
            <Header />
            {sessionStorage.getItem("logged-in")?<Profile />:<Navigate to="/login"/>}
        </div>
    );
}