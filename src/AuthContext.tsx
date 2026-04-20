import React, { createContext, useContext, useMemo, useState } from "react";
import axios from "axios";
import { BASE_URL } from "./config";

type UserRole = "user" | "admin";

type AuthUser = {
    username: string;
    role: UserRole;
};

type LoginResponse = {
    accessToken: string;
    user: AuthUser;
};

type AuthContextValue = {
    user: AuthUser | null;
    token: string;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
};

const AUTH_TOKEN_KEY = "ngo_auth_token";
const AUTH_USER_KEY = "ngo_auth_user";
const AUTH_LOGIN_URL = `${BASE_URL}/api/auth/login`;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const getStoredUser = (): AuthUser | null => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        return null;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_KEY) || "");
    const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

    const logout = () => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(AUTH_USER_KEY);
        setToken("");
        setUser(null);
    };

    const login = async (username: string, password: string) => {
        const response = await axios.post<LoginResponse>(AUTH_LOGIN_URL, { username, password });
        const { accessToken, user: loginUser } = response.data;
        localStorage.setItem(AUTH_TOKEN_KEY, accessToken);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loginUser));
        setToken(accessToken);
        setUser(loginUser);
    };

    const value = useMemo(
        () => ({
            user,
            token,
            isAuthenticated: Boolean(token && user),
            login,
            logout,
        }),
        [user, token]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
};
