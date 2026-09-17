import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { UserDTO } from '@/types';
import { getMe, loginUser, registerUser, RegisterPayload, signOut as doSignOut } from '@/services/authService';
import { getToken, loadStoredToken, saveToken } from '@/services/tokenStore';

interface AuthContextValue {
  token: string | null;
  user: UserDTO | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: RegisterPayload) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      const stored = await loadStoredToken();
      if (!active) return;
      setToken(stored);
      if (stored) {
        const me = await getMe();
        if (active) {
          if (me) {
            setUser(me);
          } else {
            setToken(null);
            await saveToken(null);
          }
        }
      }
      if (active) setIsLoading(false);
    })();

    return () => {
      active = false;
    };
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await getMe();
    setUser(me);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { token: newToken } = await loginUser(email, password);
    await saveToken(newToken);
    setToken(newToken);
    const me = await getMe();
    setUser(me);
  }, []);

  const signUp = useCallback(async (payload: RegisterPayload) => {
    const { token: newToken } = await registerUser(payload);
    await saveToken(newToken);
    setToken(newToken);
    const me = await getMe();
    setUser(me);
  }, []);

  const signOut = useCallback(async () => {
    await doSignOut();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, isLoading, signIn, signUp, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}