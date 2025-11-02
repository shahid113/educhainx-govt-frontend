// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect} from 'react';
import { login, logout, getProfile } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app load using /profile
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.user); // Backend returns user info
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const loginUser = async (username, password) => {
    try {
      await login(username, password);
      const profileRes = await getProfile();
      setUser(profileRes.data);
      return true;
    } catch (err) {
      return false;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{user, loading, loginUser, logoutUser}}>
      {children}
    </AuthContext.Provider>
  );
};