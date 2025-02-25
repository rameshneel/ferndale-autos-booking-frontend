import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { privateApi, checkAuth, refreshAccessToken } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const response = await checkAuth();
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        if (error.response?.status === 401) {
          await refreshAndRetry();
        } else {
          setIsAuthenticated(false);
        }
      }
    };
    initializeAuth();
  }, []);

  const updateAuthStatus = (authenticated) => {
    setIsAuthenticated(authenticated);
  };

  const refreshAndRetry = async () => {
    try {
      await refreshAccessToken();
      const { authenticated } = await checkAuth();
      setIsAuthenticated(authenticated);
    } catch (error) {
      updateAuthStatus(false);
    }
  };

  useEffect(() => {
    privateApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await refreshAccessToken();
            return privateApi(error.config);
          } catch (refreshError) {
            updateAuthStatus(false);
          }
        }
        // if (error.response?.status === 403) {
        //   // navigate("/login");
        //   updateAuthStatus(false);
        // }
        return Promise.reject(error);
      }
    );
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, updateAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
