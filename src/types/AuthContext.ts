export interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  handleLogin: () => void;  // just mark logged in (after login API call)
  handleLogout: () => Promise<void>; // call logout API and update state
}