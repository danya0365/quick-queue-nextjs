/**
 * IAuthRepository
 * Simple auth repository interface using SQLite
 * For shop owner authentication
 */

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface IAuthRepository {
  /**
   * Login with username and password
   */
  login(credentials: LoginCredentials): Promise<AuthUser | null>;

  /**
   * Check if a session token is valid
   */
  validateSession(token: string): Promise<AuthUser | null>;

  /**
   * Logout (invalidate token)
   */
  logout(token: string): Promise<void>;
}
