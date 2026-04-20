import React from "react"
import './css/navbar.css'
import { NavLink } from 'react-router-dom'
import { BarChart3, FileText, House, Upload } from 'lucide-react';
import { useAuth } from "./AuthContext";

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const links = [
        { to: "/home", label: "Home", icon: <House size={16} strokeWidth={2} /> },
        { to: "/submit", label: "Submit Report", icon: <FileText size={16} strokeWidth={2} /> },
        { to: "/upload", label: "Bulk Upload", icon: <Upload size={16} strokeWidth={2} /> },
        ...(user?.role === "admin" ? [{ to: "/dashboard", label: "Dashboard", icon: <BarChart3 size={16} strokeWidth={2} /> }] : []),
    ];

    return (
        <>
            <header className="header">
                <div className="header-title">NGO Reporting Portal</div>
                <div className="header-actions">
                    {isAuthenticated ? (
                        <>
                            {links.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) => `navbar-btns ${isActive ? "navbar-btns-active" : ""}`}
                                >
                                    {link.icon}
                                    <span>{link.label}</span>
                                </NavLink>
                            ))}
                            {/* <span className="navbar-btns">{user?.username} ({user?.role})</span>*/}
                            <button className="navbar-btns" type="button" onClick={logout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <NavLink to="/login" className={({ isActive }) => `navbar-btns ${isActive ? "navbar-btns-active" : ""}`}>
                            Login
                        </NavLink>
                    )}
                </div>
            </header>
            {isAuthenticated && (
                <div className="text-center mt-1">
                    <span className="fw-bold">
                        Welcome {user?.username}
                    </span>

                    {user?.role !== "admin" && (
                        <span className="text-danger mt-1">
                             &nbsp;| You do not have admin rights
                        </span>
                    )}
                </div>
            )}
        </>
    )
}

export default Navbar