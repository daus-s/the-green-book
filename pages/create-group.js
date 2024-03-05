import CreateGroup from "../components/CreateGroup";
import Header from "../components/Header";
import ProtectedRoute from './_ProtectedRoute';

export default function NewGroupPage() {
    return (
        <ProtectedRoute>
            <div className="App">
                <Header/>
                <CreateGroup />
            </div>
        </ProtectedRoute>
    );
}