# Strict Role-Based Access Control Implementation

## Overview

This implementation enforces **strict role isolation** - users cannot access different role panels simultaneously with the same session. A user logged in as "user" cannot access "vendor" or "admin" panels without logging out and logging back in with a different role.

---

## Architecture

### Frontend Protection Layers

```
Layer 1: Route Guards (StrictProtectedRoute)
├─ Checks: activeRole === requiredRole
├─ Blocks: User trying to access wrong role
└─ Redirects: To dashboard of their current role

Layer 2: API Client (apiClient.js)
├─ Checks: activeRole before API call
├─ Blocks: Vendor API from user role
├─ Blocks: Admin API from non-admin role
└─ Rejects: Request if role mismatch

Layer 3: Role Guard Utilities (roleGuard.js)
├─ Checks: User permissions
├─ Validates: Token consistency
├─ Handles: Role switching logic
└─ Provides: Access helpers

Layer 4: UI Components
├─ Login: Requires role selection
├─ RoleSwitch: Logout + re-login
└─ Navigation: Role-specific menus
```

### Backend Validation

```
Every API Request:
1. Authorization middleware validates JWT
2. Extracts activeRole from token
3. Route middleware checks activeRole
4. authorize('role') middleware enforces role
5. Returns 403 if role mismatch
```

---

## Files Created/Modified

### New Frontend Files

1. **`frontend/src/routes/StrictProtectedRoute.jsx`**
   - Strict route guard component
   - Blocks access if activeRole ≠ requiredRole
   - Redirects to appropriate dashboard

2. **`frontend/src/utils/roleGuard.js`**
   - Role checking utilities
   - Permission validation helpers
   - Token validation functions
   - Available roles management

3. **`frontend/src/api/apiClient.js`** (Updated)
   - Request interceptor with role checks
   - Response interceptor for role errors
   - Role-specific API methods (userAPI, vendorAPI, adminAPI)
   - Prevents cross-role API calls

4. **`frontend/src/components/RoleSwitchModal.jsx`**
   - Modal for switching roles
   - Handles logout + re-login flow
   - Shows available roles to switch to

5. **`frontend/src/components/LoginEnhanced.jsx`**
   - Enhanced login form
   - Requires role selection
   - Shows security warnings
   - Handles role-specific redirects

---

## Implementation Steps

### Step 1: Update Your App Routes

**File**: `frontend/src/App.jsx` or `frontend/src/routes/index.jsx`

```javascript
import StrictProtectedRoute from './routes/StrictProtectedRoute';
import LoginEnhanced from './components/LoginEnhanced';
import RoleSwitchModal from './components/RoleSwitchModal';

function App() {
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginEnhanced />} />
      <Route path="/signup" element={<Signup />} />

      {/* User Routes - STRICT */}
      <Route path="/dashboard" element={
        <StrictProtectedRoute requiredRole="user">
          <Dashboard />
        </StrictProtectedRoute>
      } />
      <Route path="/profile" element={
        <StrictProtectedRoute requiredRole="user">
          <UserProfile />
        </StrictProtectedRoute>
      } />

      {/* Vendor Routes - STRICT */}
      <Route path="/vendor/dashboard" element={
        <StrictProtectedRoute requiredRole="vendor">
          <VendorDashboard />
        </StrictProtectedRoute>
      } />
      <Route path="/vendor/earnings" element={
        <StrictProtectedRoute requiredRole="vendor">
          <VendorEarnings />
        </StrictProtectedRoute>
      } />

      {/* Admin Routes - STRICT */}
      <Route path="/admin/dashboard" element={
        <StrictProtectedRoute requiredRole="admin">
          <AdminDashboard />
        </StrictProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <StrictProtectedRoute requiredRole="admin">
          <AdminUsers />
        </StrictProtectedRoute>
      } />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

### Step 2: Update Login Form

Replace your existing Login component with `LoginEnhanced.jsx`:

```javascript
// In your main router file
import LoginEnhanced from './components/LoginEnhanced';

// Change from:
// <Route path="/login" element={<Login />} />
// To:
<Route path="/login" element={<LoginEnhanced />} />
```

### Step 3: Update Navigation/Navbar

**File**: `frontend/src/pages/Navbar.jsx` or your navbar component

```javascript
import { useNavigate } from 'react-router-dom';
import { getActiveRole } from '../utils/roleGuard';
import RoleSwitchModal from '../components/RoleSwitchModal';

const Navbar = () => {
  const [showRoleSwitch, setShowRoleSwitch] = useState(false);
  const activeRole = getActiveRole();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="text-xl font-bold">Cayman Maintenance</div>

          {/* Navigation Links based on activeRole */}
          <div className="flex gap-6">
            {activeRole === 'user' && (
              <>
                <a href="/dashboard">Dashboard</a>
                <a href="/services">Services</a>
              </>
            )}
            {activeRole === 'vendor' && (
              <>
                <a href="/vendor/dashboard">Dashboard</a>
                <a href="/vendor/earnings">Earnings</a>
                <a href="/vendor/bookings">Bookings</a>
              </>
            )}
            {activeRole === 'admin' && (
              <>
                <a href="/admin/dashboard">Dashboard</a>
                <a href="/admin/users">Users</a>
                <a href="/admin/vendors">Vendors</a>
              </>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {/* Role Badge */}
            <div className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
              {activeRole?.toUpperCase()}
            </div>

            {/* Role Switch Button (if user has multiple roles) */}
            {user.roles?.length > 1 && (
              <button
                onClick={() => setShowRoleSwitch(true)}
                className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Switch Role
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Role Switch Modal */}
      <RoleSwitchModal isOpen={showRoleSwitch} onClose={() => setShowRoleSwitch(false)} />
    </nav>
  );
};

export default Navbar;
```

### Step 4: Use Role-Specific API Methods

**File**: `frontend/src/pages/VendorDashboard.jsx`

```javascript
import { vendorAPI } from '../api/apiClient';
import toast from 'react-hot-toast';

const VendorDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        // ✅ This will be blocked if user is not logged in as vendor
        const response = await vendorAPI.getProfile();
        setDashboard(response.data);
      } catch (error) {
        // ❌ If role mismatch:
        // - User is redirected to login
        // - Or shown error: "Only vendors can access this endpoint"
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Vendor Dashboard</h1>
      {/* Vendor content */}
    </div>
  );
};

export default VendorDashboard;
```

### Step 5: Admin Role Management UI

**File**: `frontend/src/components/AdminRoleManager.jsx`

```javascript
import { adminAPI } from '../api/apiClient';
import toast from 'react-hot-toast';

const AdminRoleManager = ({ userId }) => {
  const [userRoles, setUserRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserRoles();
  }, [userId]);

  const fetchUserRoles = async () => {
    try {
      // ✅ This will work only if logged in as admin
      const response = await adminAPI.getUserRoles(userId);
      setUserRoles(response.data.user.roles);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const assignRole = async (role) => {
    try {
      setLoading(true);
      // ✅ Admin-only endpoint
      const response = await adminAPI.assignRole(userId, role);
      setUserRoles(response.data.user.roles);
      toast.success(`Role '${role}' assigned`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const removeRole = async (role) => {
    try {
      setLoading(true);
      // ✅ Admin-only endpoint
      const response = await adminAPI.removeRole(userId, role);
      setUserRoles(response.data.user.roles);
      toast.success(`Role '${role}' removed`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">User Roles</h3>
      
      <div className="flex gap-2">
        {userRoles.map(role => (
          <div key={role} className="flex items-center gap-2 bg-indigo-100 px-3 py-1 rounded">
            <span className="capitalize">{role}</span>
            <button
              onClick={() => removeRole(role)}
              disabled={loading || userRoles.length === 1}
              className="text-red-600 hover:text-red-800 disabled:text-gray-400"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={() => assignRole('vendor')}
          disabled={loading || userRoles.includes('vendor')}
          className="px-3 py-1 bg-indigo-600 text-white rounded disabled:bg-gray-400"
        >
          Assign Vendor
        </button>
      </div>
    </div>
  );
};

export default AdminRoleManager;
```

---

## Security Features Implemented

### 1. Route-Level Protection
```javascript
// User cannot access vendor routes
<Route path="/vendor/dashboard" element={
  <StrictProtectedRoute requiredRole="vendor">
    <VendorDashboard />
  </StrictProtectedRoute>
} />
// ✅ If user tries to directly access: Redirected to user dashboard
```

### 2. API-Level Protection
```javascript
// Vendor API rejects non-vendor roleconst createVendorProfile = async (data) => {
  if (!canAccessRole('vendor')) {
    return Promise.reject(new Error('Only vendors can access this endpoint'));
  }
  return apiClient.post('/api/vendors/create', data);
};
// ✅ Client-side rejection + server-side rejection
```

### 3. Token-Based Enforcement
```javascript
// Token contains activeRole
{
  id: "userId",
  email: "user@email.com",
  activeRole: "vendor"  // 🔒 Locked to this role
}
// ✅ Cannot use this token to access user endpoints
```

### 4. Session Isolation
```javascript
// User must logout and login again to switch roles
handleRoleSwitch = (newRole) => {
  localStorage.removeItem('token');          // Clear token
  localStorage.removeItem('user');           // Clear user
  navigate('/login', { state: { role: newRole } });  // Go to login
};
// ✅ New token generated with new activeRole
```

---

## Testing The Implementation

### Test 1: User Cannot Access Vendor Panel
```
1. Login as user
2. Try to visit /vendor/dashboard
3. Expected: Redirected to /dashboard
4. Console: "Access Denied: User logged in as 'user' tried to access 'vendor' panel"
```

### Test 2: Vendor Cannot Call User API
```
1. Login as vendor
2. Try to call userAPI.getProfile()
3. Expected: Error "Only vendors can access this endpoint"
```

### Test 3: Admin Cannot Access User Panel with User Role
```
1. Create user with both 'user' and 'admin' roles
2. Login with role='user'
3. Try to access /admin/dashboard
4. Expected: Redirected to /dashboard
```

### Test 4: Admin Cannot Bypass with Token Injection
```
1. Login as user (get userToken)
2. Try to manually set adminToken in localStorage
3. Expected: Backend rejects - "activeRole 'user' not authorized"
```

### Test 5: Role Switching Works
```
1. Login as user
2. Click "Switch Role" button
3. Select "vendor"
4. Expected: Logged out, redirected to login with vendor role pre-selected
5. Re-login creates new token with activeRole='vendor'
```

---

## Error Handling

### 403 Forbidden - Role Not Authorized
```javascript
// User tries to access admin endpoint while logged in as user
Response: 403 Forbidden
{
  "success": false,
  "message": "Active role 'user' is not authorized to access this route"
}

// Frontend handles:
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/login?error=role_mismatch';
```

### 401 Unauthorized - Token Expired
```javascript
// Token expired or removed by admin
Response: 401 Unauthorized

// Frontend handles:
localStorage.removeItem('token');
localStorage.removeItem('user');
window.location.href = '/login';
```

---

## Common Issues & Solutions

### Issue: User can still access vendor panel in browser
**Cause**: Using old ProtectedRoute, not StrictProtectedRoute
**Solution**: Replace all ProtectedRoute with StrictProtectedRoute

### Issue: API calls still work for wrong role
**Cause**: Not using role-specific API methods
**Solution**: Use vendorAPI.method() instead of apiClient.post()

### Issue: Role switch doesn't work
**Cause**: Not clearing localStorage before re-routed to login
**Solution**: Ensure RoleSwitchModal clears both 'token' and 'user'

### Issue: 403 errors not being handled
**Cause**: Response interceptor not configured
**Solution**: Use the updated apiClient.js with interceptors

---

## Deployment Checklist

- [ ] Replace old Login with LoginEnhanced
- [ ] Update all routes to use StrictProtectedRoute
- [ ] Update API calls to use userAPI, vendorAPI, adminAPI
- [ ] Update Navbar with role switching button
- [ ] Update AdminDashboard with role management UI
- [ ] Test role isolation in all panels
- [ ] Test role switching workflow
- [ ] Verify 403 error handling
- [ ] Clear browser cache before testing
- [ ] Test with multiple users having multiple roles

---

## Quick Reference

| Scenario | Before | After |
|----------|--------|-------|
| User accessing vendor panel | ✅ Allowed | ❌ Redirected |
| Same email, multiple roles | ✅ All accessible | ❌ One active role |
| Switching roles | ✅ No logout needed | ❌ Must logout + login |
| API call with wrong role | ✅ Might work | ❌ Rejected |
| Token with old role | ✅ Works | ❌ Rejected |

---

This implementation provides **enterprise-grade role isolation** where each role is completely separate and users cannot access other roles' functionality without proper re-authentication.
