import { apiRequest, ApiError } from '../../lib/http';
import type { User, LoginInput, RegisterInput } from './types';

const AUTH_PATH = '/api/auth';

export function loginUser(input: LoginInput): Promise<User> {
  return apiRequest<User>(`${AUTH_PATH}/login`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function registerUser(input: RegisterInput): Promise<User> {
  return apiRequest<User>(`${AUTH_PATH}/register`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function logoutUser(): Promise<void> {
  return apiRequest<void>(`${AUTH_PATH}/logout`, {
    method: 'POST',
  });
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    return await apiRequest<User>(`${AUTH_PATH}/me`);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === 401) {
      return null;
    }

    throw error;
  }
}
