import Header from "../Header";
import Social from "../Social";
import { Navigate } from 'react-router-dom';
export default function SocialPage() {
    return (
        <div className="App">
            <Header />
            {sessionStorage.getItem("logged-in")?<Social />:<Navigate to="/login"/>}
        </div>
    );
}