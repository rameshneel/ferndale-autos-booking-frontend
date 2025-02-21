import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
} from "react";
const BASE_URL = "https://in.prelaunchserver.com/zacks-gutter/api/api";
// const BASE_URL = "https://api.zacsgutters.co.uk/api";
// const  BASE_URL= "http://localhost:5000/api";
// const  BASE_URL= "https://6d7e-2405-201-32-8091-b5c5-4f17-bc04-fece.ngrok-free.app/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkAuthStatus = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/protected`, {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   checkAuthStatus(); // Initial auth check jab provider mount hota hai
  // }, [checkAuthStatus]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        setIsAuthenticated(true);
        return { success: true };
      } else {
        const errorData = await response.json();
        return {
          success: false,
          message: errorData.message || response.statusText,
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An unexpected error occurred." };
    }
  };

  const logout = async () => {
    try {
      await fetch(`${BASE_URL}/users/logout`, {
        method: "POST",
        credentials: "include",
      });
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, checkAuthStatus, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
