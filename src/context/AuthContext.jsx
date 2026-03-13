import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// creating context for authentication
const AuthContext = createContext();

// custom hook to use auth context easily
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // check if user is already logged in when app starts
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.log("error parsing user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // login function
  const login = async (email, password) => {
    try {
      console.log("attempting login...");
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password
      });

      const userData = response.data.user;
      console.log("login successful for:", userData.email);

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.log("login error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Login failed";
      return { success: false, error: errorMessage };
    }
  };

  // register function
  const register = async (name, email, password) => {
    try {
      console.log("registering new user:", email);
      const response = await axios.post("http://localhost:5000/api/register", {
        name,
        email,
        password
      });

      console.log("registration successful");
      return { success: true, message: response.data.message };
    } catch (error) {
      console.log("registration error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Registration failed";
      return { success: false, error: errorMessage };
    }
  };

  // logout function
  const logout = () => {
    console.log("logging out user");
    setUser(null);
    localStorage.removeItem("user");
  };

  // check if user is logged in
  const isAuthenticated = () => {
    return user !== null;
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
