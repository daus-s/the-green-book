import GroupManager from "../components/GroupManager";
import Header from "../components/Header";

import { Navigate } from 'react-router-dom';
import { isLoggedIn } from "../../functions/LoginBool";

export default function ManageGroupPage() {
    return (
        <div className="App">
            <Header />
            {isLoggedIn()?<GroupManager />:<Navigate to="/login"/>}            
        </div>
    );
}