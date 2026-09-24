import { useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, LoginInput, RegisterInput } from './types';
import { loginUser, registerUser, logoutUser, getCurrentUser } from './api';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const login = async (input: LoginInput): Promise<void> => {
    const signedInUser = await loginUser(input);
    setUser(signedInUser);
    setError(null);
  };

  const register = async (input: RegisterInput): Promise<void> => {
    const newUser = await registerUser(input);
    setUser(newUser);
    setError(null);
  };

  const logout = async (): Promise<void> => {
    await logoutUser();
    setUser(null);
  };

  const refreshUser = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to check your session.',
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const currentUser = await getCurrentUser();
        if (!cancelled) setUser(currentUser);
      } catch (error) {
        if (!cancelled) {
          setError(
            error instanceof Error
              ? error.message
              : 'Unable to check your session.',
          );
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        refreshUser,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
