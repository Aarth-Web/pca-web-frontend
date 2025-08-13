import useAuthStore from "../store/authStore";

/**
 * Utility function to handle unauthorized errors in a React context
 * This can be used when window.location.href isn't appropriate (like in components)
 */
export const handleUnauthorized = (navigate: any) => {
  // Clear auth state
  useAuthStore.getState().clearAuth();
  // Navigate to login page with unauthorized parameter
  navigate("/login?unauthorized=true");
};

/**
 * Check if an error is an unauthorized error (401)
 */
export const isUnauthorizedError = (error: any): boolean => {
  return error?.response?.status === 401;
};
