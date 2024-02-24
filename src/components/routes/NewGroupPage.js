import CreateGroup from "../CreateGroup";
import Header from "../Header";

import { Navigate } from 'react-router-dom';

export default function NewGroupPage() {
    return (
    <div className="App">
        <Header/>
        {sessionStorage.getItem("logged-in")?<CreateGroup />:<Navigate to="/login"/>}
    </div>);
}