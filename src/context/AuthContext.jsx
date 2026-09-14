import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hrc_user') || 'null');
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: u, accessToken, refreshToken } = res.data.data;
      localStorage.setItem('hrc_access_token', accessToken);
      localStorage.setItem('hrc_refresh_token', refreshToken);
      localStorage.setItem('hrc_user', JSON.stringify(u));
      setUser(u);
      return u;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('hrc_refresh_token');
      await api.post('/auth/logout', { refreshToken });
    } catch {
      /* ignore network errors on logout */
    } finally {
      localStorage.removeItem('hrc_access_token');
      localStorage.removeItem('hrc_refresh_token');
      localStorage.removeItem('hrc_user');
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Re-validate session on mount.
    const token = localStorage.getItem('hrc_access_token');
    if (token && !user) {
      api
        .get('/auth/me')
        .then((res) => setUser(res.data.data))
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthContext;
