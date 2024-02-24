import GroupManager from "../GroupManager";
import Header from "../Header";

export default function ManageGroupPage() {
    return (
        <div className="App">
            <Header />
            {sessionStorage.getItem("logged-in")?<GroupManager />:<Navigate to="/login"/>}            
        </div>
    );
}