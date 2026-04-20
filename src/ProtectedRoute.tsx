import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

type ProtectedRouteProps = {
    allowedRoles?: Array<"user" | "admin">;
};

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
