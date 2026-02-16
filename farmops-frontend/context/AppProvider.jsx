"use client"

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const { createContext, useState, useEffect, useContext } = require("react");

const AppContext = createContext();
const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Helper function to convert error object to string
const getErrorMessage = (message) => {
    if (typeof message === 'string') {
        return message;
    }
    if (typeof message === 'object' && message !== null) {
        // Convert validation error object to string
        const errors = [];
        for (const key in message) {
            if (Array.isArray(message[key])) {
                errors.push(message[key][0]);
            } else {
                errors.push(message[key]);
            }
        }
        return errors.join(', ') || 'An error occurred';
    }
    return 'An error occurred';
};

export const AppProvider = ({ children }) => {

    const router = useRouter();

    const [authToken, setAuthToken] = useState(null);

    useEffect(() => {
        let token = Cookies.get('authToken');
        if (token) {
            setAuthToken(token);
        } else {
            router.push('/auth');
        }
    })

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (data.success) {
                Cookies.set('authToken', data.token)
                setAuthToken(data.token);

                router.push('/dashboard');
                toast.success("User Login !");
            } else {
                toast.error(getErrorMessage(data.message));
            }
            return data;
        } catch (error) {
            toast.error("login failed");
            console.error("Login failed:", error);
            throw error;
        }
    }

    const register = async (name, email, mobile, password, confirmPassword) => {
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ name, email, mobile, password, password_confirmation: confirmPassword }),
            });

            const data = await res.json();
            if (data.success) {
                login(email, password);
            } else {
                toast.error(getErrorMessage(data.message));
            }
            return data;
        } catch (error) {
            toast.error("Registeration failed");
            console.error("Registeration failed:", error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            const res = await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
            });

            const data = await res.json();
            if (data.success) {
                setAuthToken(null);
                Cookies.remove('authToken');
                toast.success(data.message);
            } else {
                toast.error(getErrorMessage(data.message));
            }
            return data;
        } catch (error) {
            toast.error("logouFailed");
            console.error("Logout failed:", error);
            throw error;
        }
    }

    const forgotPassword = async (email) => {
        try {
            const res = await fetch(`${API_URL}/forgot-password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(data.message || 'Password reset link sent to your email!');
            } else {
                toast.error(getErrorMessage(data.message));
            }
            return data;
        } catch (error) {
            toast.error("Failed to send reset link");
            console.error("Forgot password failed:", error);
            throw error;
        }
    }

    const resetPassword = async (token, email, password, passwordConfirmation) => {
        try {
            const res = await fetch(`${API_URL}/reset-password`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ 
                    token,
                    email,
                    password,
                    password_confirmation: passwordConfirmation
                }),
            });

            const data = await res.json();
            if (data.success) {
                toast.success(data.message || 'Password reset successfully!');
            } else {
                toast.error(getErrorMessage(data.message));
            }
            return data;
        } catch (error) {
            toast.error("Failed to reset password");
            console.error("Reset password failed:", error);
            throw error;
        }
    }

    return (
        <AppContext.Provider value={{ login, register, logout, authToken, forgotPassword, resetPassword }}>
            {children}
        </AppContext.Provider>
    );

}

export const MyHook = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("MyHook must be used within an AppProvider");
    }
    return context;
}