/**
 * Client-side JWT configuration
 * This file contains JWT-related configuration for the client side
 */
export const jwtConfig = {
  /**
   * JWT token storage key in localStorage
   */
  storageKey: 'token',
  
  /**
   * Helper function to get the JWT token from localStorage
   */
  getToken: (): string | null => {
    return localStorage.getItem(jwtConfig.storageKey);
  },
  
  /**
   * Helper function to set the JWT token in localStorage
   */
  setToken: (token: string): void => {
    localStorage.setItem(jwtConfig.storageKey, token);
  },
  
  /**
   * Helper function to remove the JWT token from localStorage
   */
  removeToken: (): void => {
    localStorage.removeItem(jwtConfig.storageKey);
  },
  
  /**
   * Helper function to get the Authorization header with the JWT token
   */
  getAuthHeader: (): { Authorization: string } | undefined => {
    const token = jwtConfig.getToken();
    return token ? { Authorization: `Bearer ${token}` } : undefined;
  }
};

export default jwtConfig; 