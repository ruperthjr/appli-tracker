import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { setupAxiosInterceptors } from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const STORAGE_KEY_JOBS = "jobs";
  const STORAGE_KEY_TOKEN = "token";
  const STORAGE_KEY_USER = "user";

  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [token, setToken] = useState(
    () => localStorage.getItem(STORAGE_KEY_TOKEN) || null
  );
  const [loading, setLoading] = useState(true);

  const safeParse = (raw) => {
    try {
      if (raw == null) return null;
      return JSON.parse(raw);
    } catch (e) {
      console.warn("safeParse failed:", e, raw);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEY_TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEY_USER);
    const storedJobs = localStorage.getItem(STORAGE_KEY_JOBS);

    if (storedToken && storedUser) {
      setToken(storedToken);
      const parsedUser = safeParse(storedUser);
      setUser(parsedUser || null);

      const parsedJobs = safeParse(storedJobs);
      setJobs(Array.isArray(parsedJobs) ? parsedJobs : []);
      setupAxiosInterceptors(storedToken);
    } else {
      const parsedJobs = safeParse(storedJobs);
      setJobs(Array.isArray(parsedJobs) ? parsedJobs : []);
    }

    setLoading(false);
  }, []);

  const persistJobs = useCallback((nextJobsArray) => {
    try {
      const toStore = Array.isArray(nextJobsArray) ? nextJobsArray : [];
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(toStore));
    } catch (e) {
      console.error("persistJobs failed:", e);
    }
  }, []);

  const storeJobs = useCallback(
    (jobsDataOrUpdater) => {
      setJobs((prev) => {
        const prevArr = Array.isArray(prev) ? prev : [];
        let next;
        if (typeof jobsDataOrUpdater === "function") {
          try {
            next = jobsDataOrUpdater(prevArr);
          } catch (e) {
            console.error("storeJobs updater threw:", e);
            next = prevArr;
          }
        } else {
          next = jobsDataOrUpdater;
        }
        next = Array.isArray(next) ? next : [];
        persistJobs(next);
        return next;
      });
    },
    [persistJobs]
  );

  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    try {
      localStorage.setItem(STORAGE_KEY_TOKEN, authToken);
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(userData));
    } catch (e) {
      console.error("login localStorage write failed:", e);
    }
    setupAxiosInterceptors(authToken);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setJobs([]);
    try {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
      localStorage.removeItem(STORAGE_KEY_JOBS);
    } catch (e) {
      console.error("logout localStorage cleanup failed:", e);
    }
    setupAxiosInterceptors(null);
  }, []);

  const isAuthenticated = useCallback(() => !!token, [token]);

  const value = useMemo(
    () => ({
      user,
      token,
      jobs,
      storeJobs,
      login,
      logout,
      isAuthenticated,
      loading,
    }),
    [user, token, jobs, storeJobs, login, logout, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);