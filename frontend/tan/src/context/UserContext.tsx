import React, { createContext, useContext, useEffect, useState } from 'react';
import type { CurrentUser } from '../services/authService';
import authService from '../services/authService';

interface UserContextType {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<CurrentUser | null>;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
  const c = useContext(UserContext);
  if (!c) throw new Error('useUserContext debe usarse dentro de UserProvider');
  return c;
}

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async (): Promise<CurrentUser | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.fetchCurrentUser();
      setUser(data);
      return data;
    } catch (err: any) {
      setUser(null);
      setError(err instanceof Error ? err.message : String(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  const logout = () => {
    authService.clearTokens();
    setUser(null);
  }

  useEffect(() => {
    // Intentar obtener usuario al montar si hay token
    (async () => {
      await refresh();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, refresh, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;