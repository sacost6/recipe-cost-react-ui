import { createContext, useContext } from 'react';
import type { AuthContexType } from './types';

export const AuthContext = createContext<AuthContexType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used with an AuthProvider.');
  }

  return context;
}
