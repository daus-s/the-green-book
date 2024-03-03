import CreateGroup from "../components/CreateGroup";
import Header from "../components/Header";

import { Navigate } from 'react-router-dom';
import { isLoggedIn } from "../functions/LoginBool";

export default function NewGroupPage() {
    return (
    <div className="App">
        <Header/>
        {isLoggedIn()?<CreateGroup />:<Navigate to="/login"/>}
    </div>);
}