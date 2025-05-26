import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { odooService } from '../lib/odooService';

interface OdooAuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const OdooAuthContext = createContext<OdooAuthContextType | undefined>(undefined);

export const OdooAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = odooService.isAuthenticated();
      setIsAuthenticated(isAuth);
      if (isAuth) {
        setUser(odooService.getSession());
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const session = await odooService.login(username, password);
      setIsAuthenticated(true);
      setUser(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    
    try {
      await odooService.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <OdooAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
        error
      }}
    >
      {children}
    </OdooAuthContext.Provider>
  );
};

export const useOdooAuth = () => {
  const context = useContext(OdooAuthContext);
  if (context === undefined) {
    throw new Error('useOdooAuth must be used within an OdooAuthProvider');
  }
  return context;
};