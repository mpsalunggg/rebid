import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { User } from '@/features/auth/auth.types';

type AuthContextValue = {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const trimmed = email.trim();
      if (!trimmed || !password) {
        setError('Email and password are required');
        return false;
      }

      await new Promise<void>(r => setTimeout(r, 400));

      setToken('mock-token');
      setUser({
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Demo User',
        email: trimmed,
        role: 'user',
        created_at: new Date().toISOString(),
      });
      return true;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isLoggedIn: user !== null && token !== null,
      user,
      token,
      isLoading,
      error,
      signIn,
      signOut,
      clearError,
    }),
    [user, token, isLoading, error, signIn, signOut, clearError],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
