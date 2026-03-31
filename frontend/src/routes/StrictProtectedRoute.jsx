// frontend/src/routes/StrictProtectedRoute.jsx
import { Navigate } from 'react-router-dom';

/**
 * StrictProtectedRoute - Prevents access to endpoints for different roles
 * User cannot access vendor/admin panels, vendor cannot access user/admin panels, etc.
 * 
 * Usage:
 * <Route path="/vendor/dashboard" element={
 *   <StrictProtectedRoute requiredRole="vendor">
 *     <VendorDashboard />
 *   </StrictProtectedRoute>
 * } />
 */
const StrictProtectedRoute = ({ children, requiredRole }) => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');

  // No token or user = not logged in
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  try {
    const userData = JSON.parse(user);

    // ❌ STRICT CHECK: activeRole MUST match required role exactly
    if (userData.activeRole !== requiredRole) {
      console.warn(
        `❌ Access Denied: User logged in as '${userData.activeRole}' tried to access '${requiredRole}' panel`
      );
      
      // Redirect to appropriate dashboard for their current role
      if (userData.activeRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (userData.activeRole === 'vendor') {
        return <Navigate to="/vendor/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }

    // ✅ Role matches, allow access
    return children;
  } catch (error) {
    console.error('Error parsing user data:', error);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
};

export default StrictProtectedRoute;
