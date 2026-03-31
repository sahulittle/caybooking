// frontend/src/utils/roleGuard.js
/**
 * Role Guard Utilities - Enforce role-based access control
 * Prevents users from accessing endpoints/UI for roles they don't have
 */

/**
 * Check if user can access a specific role's panel
 * @param {string} requiredRole - Role needed to access (e.g., 'vendor', 'admin')
 * @returns {boolean} - True if user's activeRole matches required role
 */
export const canAccessRole = (requiredRole) => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return false;
    
    const userData = JSON.parse(user);
    return userData.activeRole === requiredRole;
  } catch {
    return false;
  }
};

/**
 * Get user's current active role
 * @returns {string|null} - Current active role or null
 */
export const getActiveRole = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    const userData = JSON.parse(user);
    return userData.activeRole;
  } catch {
    return null;
  }
};

/**
 * Get all roles assigned to user
 * @returns {array} - List of roles user has
 */
export const getUserRoles = () => {
  try {
    const user = localStorage.getItem('user');
    if (!user) return [];
    
    const userData = JSON.parse(user);
    return userData.roles || [];
  } catch {
    return [];
  }
};

/**
 * Check if user has permission to access a role panel
 * Note: This checks if they HAVE the role, not if they're currently logged in with it
 * @param {string} role - Role to check
 * @returns {boolean}
 */
export const hasRole = (role) => {
  try {
    const roles = getUserRoles();
    return roles.includes(role);
  } catch {
    return false;
  }
};

/**
 * Enforce role access - redirect if not authorized
 * @param {string} requiredRole - Required role for access
 * @param {function} redirectCallback - Function to call if access denied (usually navigate)
 * @returns {boolean} - True if allowed, false if denied
 */
export const enforceRoleAccess = (requiredRole, redirectCallback) => {
  const hasAccess = canAccessRole(requiredRole);
  
  if (!hasAccess) {
    const currentRole = getActiveRole();
    console.warn(
      `🚫 Access Denied: Attempted to access '${requiredRole}' panel with active role '${currentRole}'`
    );
    
    if (redirectCallback) {
      redirectCallback();
    }
  }
  
  return hasAccess;
};

/**
 * Get the appropriate dashboard route for current role
 * @returns {string} - Dashboard route for active role
 */
export const getDashboardRoute = () => {
  const activeRole = getActiveRole();
  
  const dashboards = {
    'admin': '/admin/dashboard',
    'vendor': '/vendor/dashboard',
    'user': '/dashboard'
  };
  
  return dashboards[activeRole] || '/';
};

/**
 * Check if role switching is needed (user trying to access different role)
 * @param {string} targetRole - The role being accessed
 * @returns {string|null} - Error message if switching, null if allowed
 */
export const checkRoleMismatch = (targetRole) => {
  const currentRole = getActiveRole();
  
  if (currentRole !== targetRole) {
    return `You are logged in as '${currentRole}' but trying to access '${targetRole}' panel. Please log out and log back in with the correct role.`;
  }
  
  return null;
};

/**
 * Get allowed roles for logout + re-login
 * @returns {array} - List of roles user can switch to
 */
export const getAvailableRolesToSwitch = () => {
  const roles = getUserRoles();
  return roles.filter(role => role !== getActiveRole());
};

/**
 * Validate token role consistency
 * @param {string} token - JWT token from localStorage
 * @returns {boolean} - True if token is valid for active role
 */
export const isTokenValidForRole = (token) => {
  try {
    if (!token) return false;
    
    // Extract payload from JWT
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const decoded = JSON.parse(jsonPayload);
    const activeRole = getActiveRole();
    
    return decoded.activeRole === activeRole;
  } catch (error) {
    console.error('Error validating token:', error);
    return false;
  }
};
