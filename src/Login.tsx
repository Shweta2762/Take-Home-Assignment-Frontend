import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/home";

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setErrorMessage("");
        setIsSubmitting(true);

        try {
            await auth.login(username.trim(), password);
            navigate(nextPath, { replace: true });
        } catch {
            setErrorMessage("Invalid credentials. Use User/Password or Admin/admin123.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="page">
            <h1>Login</h1>
            <p>Sign in to submit reports or access dashboard.</p>
            <div className="row">
                <div className="col-md-2"></div>
                <div className="col-md-8">
                    <form className="form-card" onSubmit={onSubmit}>
                        <label className="field">
                            <span>Username</span>
                            <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="User or Admin" />
                        </label>
                        <label className="field">
                            <span>Password</span>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
                        </label>
                        <button className="primary-btn" type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Signing in..." : "Login"}
                        </button>
                    </form>
                </div>
                <div className="col-md-2"></div>
            </div>
            
            {errorMessage ? <p className="feedback error">{errorMessage}</p> : null}
            <p className="feedback">Sample creds: User / Password, Admin / admin123</p>
        </section>
    );
};

export default Login;
