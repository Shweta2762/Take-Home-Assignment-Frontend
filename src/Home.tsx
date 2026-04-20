import { Link } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Home = () => {
    const { user } = useAuth();
    return (
        <section className="page">
            <h1>Monthly NGO Impact Reporting</h1>
            <p>
                Submit one report at a time, upload monthly data in bulk, and track progress on the admin dashboard.
            </p>
            <div className="action-grid">
                <Link className="card-link" to="/submit">
                    <h3>Submit Single Report</h3>
                    <p>Use the report form for one NGO's monthly metrics.</p>
                </Link>
                <Link className="card-link" to="/upload">
                    <h3>Upload CSV in Bulk</h3>
                    <p>Upload many reports at once and track processing status.</p>
                </Link>
                {user?.role === "admin" ? (
                    <Link className="card-link" to="/dashboard">
                        <h3>View Dashboard</h3>
                        <p>See monthly totals across all NGO reports.</p>
                    </Link>
                ) : null}
            </div>
        </section>
    );
};

export default Home;