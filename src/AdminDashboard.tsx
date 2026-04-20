import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { API_ENDPOINTS, BASE_URL } from "./config";

type DashboardSummary = {
    totalNgosReporting: number;
    totalPeopleHelped: number;
    totalEventsConducted: number;
    totalFundsUtilized: number;
};

const getCurrentMonth = () => new Date().toISOString().slice(0, 7);

const AdminDashboard = () => {
    const [month, setMonth] = useState(getCurrentMonth());
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const baseApi = useMemo(() => BASE_URL, []);
    const token = localStorage.getItem("ngo_auth_token") || "";

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            setErrorMessage("");
            try {
                const response = await axios.get<DashboardSummary>(`${baseApi}${API_ENDPOINTS.dashboardSummary}`, {
                    params: { month },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSummary(response.data);
            } catch (error) {
                setErrorMessage("Unable to load dashboard metrics right now.");
                setSummary(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [baseApi, month, token]);

    return (
        <section className="page">
            <h1>Admin Dashboard</h1>
            <p>Track monthly NGO impact metrics.</p>

            <div className="month-picker">
                <label className="field">
                    <span>Select Month</span>
                    <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
                </label>
            </div>

            {loading ? <p className="feedback">Loading dashboard data...</p> : null}
            {errorMessage ? <p className="feedback error">{errorMessage}</p> : null}

            {summary ? (
                <div className="metrics-grid">
                    <article className="metric-card">
                        <h3>Total NGOs Reporting</h3>
                        <p>{summary.totalNgosReporting}</p>
                    </article>
                    <article className="metric-card">
                        <h3>Total People Helped</h3>
                        <p>{summary.totalPeopleHelped}</p>
                    </article>
                    <article className="metric-card">
                        <h3>Total Events Conducted</h3>
                        <p>{summary.totalEventsConducted}</p>
                    </article>
                    <article className="metric-card">
                        <h3>Total Funds Utilized</h3>
                        <p>{summary.totalFundsUtilized.toLocaleString()}</p>
                    </article>
                </div>
            ) : null}
        </section>
    );
};

export default AdminDashboard;