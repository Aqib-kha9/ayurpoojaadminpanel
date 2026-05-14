import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/api';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session on load
    const storedToken = localStorage.getItem('ayur_admin_token');
    const storedUser = localStorage.getItem('ayur_admin_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: any) => {
    try {
      const response = await api.post('/auth/admin/login', credentials);
      const { token: newToken, data } = response.data;

      setToken(newToken);
      setUser(data.user);

      localStorage.setItem('ayur_admin_token', newToken);
      localStorage.setItem('ayur_admin_user', JSON.stringify(data.user));
    } catch (error: any) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Admin logout API call failed', error);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('ayur_admin_token');
    localStorage.removeItem('ayur_admin_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
