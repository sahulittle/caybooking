# Role-Based Authentication Implementation

## Overview
This document explains the role-based authentication system implemented for the Cayman Maintenance application. The system allows users to have multiple roles (user, vendor, admin) and choose their active role during login.

## Key Features

### 1. Multiple Roles per User
- Users can have multiple roles: 'user', 'vendor', or 'admin'
- A single email can now be associated with both user and vendor roles
- Default role is 'user' on signup
- Admins can assign/remove roles to users

### 2. Active Role System
- When logging in, users must specify which role they want to use
- The active role is included in the JWT token
- Users can only access endpoints permitted for their active role

### 3. Role-Based Authorization
- `protect` middleware: Verifies JWT and validates the active role
- `authorize('role')` middleware: Restricts endpoints to specific roles
- Prevents users from accessing endpoints they don't have permission for

---

## Database Model Changes

### User Model
```javascript
// BEFORE (Single Role)
role: {
  type: String,
  enum: ['user', 'vendor', 'admin'],
  default: 'user'
}

// AFTER (Multiple Roles + Active Role)
roles: {
  type: [String],
  enum: ['user', 'vendor', 'admin'],
  default: ['user']
},
activeRole: {
  type: String,
  enum: ['user', 'vendor', 'admin'],
  default: 'user'
}
```

---

## Authentication Flow

### User Signup
```
POST /api/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"  // or "vendor"
}

Response:
{
  "success": true,
  "token": "Bearer <JWT_TOKEN>",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["user"],
    "activeRole": "user"
  }
}
```

### User Login with Role Selection
```
POST /api/login
{
  "email": "john@example.com",
  "password": "password123",
  "role": "vendor"  // User selects which role to use
}

Response:
{
  "success": true,
  "token": "Bearer <JWT_TOKEN>",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["user", "vendor"],  // All roles assigned to user
    "activeRole": "vendor"         // Currently active role
  }
}
```

### Admin Login
```
POST /api/login
{
  "email": "admin@cayman.com",
  "password": "ADMIN_PASSWORD",
  "role": "admin"
}
```

---

## JWT Token Structure

The token now includes:
```javascript
{
  id: "userId",
  email: "user@example.com",
  activeRole: "vendor"  // The role user logged in with
}
```

---

## Middleware Usage

### Protect Route
Verifies JWT and validates that the user's active role is in their assigned roles:
```javascript
router.get('/protected-route', protect, (req, res) => {
  // req.user = full user object
  // req.activeRole = role from JWT
});
```

### Authorize Specific Roles
Restricts access to specific roles:
```javascript
// Only vendors can access
router.post('/api/vendors/create', protect, authorize('vendor'), createVendor);

// Only admins can access
router.delete('/api/admin/users/:id', protect, authorize('admin'), deleteUser);

// Either user or vendor can access
router.get('/api/profile', protect, authorize('user', 'vendor'), getProfile);
```

---

## Role Management API (Admin Only)

### 1. Get User Roles
```
GET /api/admin/users/:userId/roles
Response:
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John",
    "email": "john@example.com",
    "roles": ["user", "vendor"],
    "activeRole": "user"
  }
}
```

### 2. Assign Role to User
```
PUT /api/admin/users/:userId/assign-role
{
  "role": "vendor"
}

Response:
{
  "success": true,
  "message": "Role 'vendor' assigned to user",
  "user": {
    "roles": ["user", "vendor"],
    "activeRole": "user"
  }
}
```

### 3. Remove Role from User
```
PUT /api/admin/users/:userId/remove-role
{
  "role": "vendor"
}

Response:
{
  "success": true,
  "message": "Role 'vendor' removed from user",
  "user": {
    "roles": ["user"],
    "activeRole": "user"
  }
}
```

NOTE: Users must have at least one role at all times

---

## Protected Routes Example

### User Routes
```javascript
router.post('/signup', signupUser);                    // Public
router.post('/login', loginUser);                      // Public
router.get('/users', protect, authorize('admin'), getAllUsers);  // Admin only
```

### Vendor Routes
```javascript
router.post('/create', protect, authorize('vendor'), createVendor);  // Vendor only
router.get('/', getAllVendors);                        // Public
router.get('/:id', getVendorById);                     // Public
router.put('/:id', protect, updateVendor);            // Vendor/Admin
router.delete('/:id', protect, authorize('admin'), deleteVendor);   // Admin only
```

### Admin Routes
```
router.use(protect, authorize('admin'));  // All routes require admin role

GET    /api/admin/users                   // List all users
DELETE /api/admin/users/:id               // Delete user
GET    /api/admin/users/:id/roles         // Get user roles
PUT    /api/admin/users/:id/assign-role   // Assign role
PUT    /api/admin/users/:id/remove-role   // Remove role
GET    /api/admin/vendors                 // List all vendors
PUT    /api/admin/vendors/:id/verify      // Verify vendor
DELETE /api/admin/vendors/:id             // Delete vendor
```

---

## Security Features

1. **Token Validation**: Active role in token must match user's assigned roles
2. **Role Enforcement**: Each route validates the user's active role
3. **Prevent Privilege Escalation**: Users cannot self-assign admin role
4. **Admin Protection**: Cannot remove admin's roles (only admins can change admin roles)
5. **Minimum Role Requirement**: Users must always have at least one role

---

## Migration Guide (Existing Users)

If you have existing users with a single `role` field:

```javascript
// Migration script example:
db.users.updateMany(
  { role: { $exists: true } },
  [
    {
      $set: {
        roles: ["$role"],
        activeRole: "$role"
      }
    }
  ]
);
```

---

## Frontend Implementation Notes

### Login Form
- Add role selector dropdown during login
- Show available roles for the user
- Store activeRole in localStorage along with token

### Multi-Role Dashboard
```javascript
// Example
const user = JSON.parse(localStorage.getItem('user'));

if (user.activeRole === 'vendor') {
  // Show vendor dashboard
} else if (user.activeRole === 'user') {
  // Show user dashboard
} else if (user.activeRole === 'admin') {
  // Show admin dashboard
}
```

### Role Switching
Users can log out and log back in with a different role to switch roles.

---

## Testing

### Test Scenarios

1. **Register as User**
   - Email: user@test.com, Role: user
   - Should have roles: ['user']

2. **Register as Vendor**
   - Email: vendor@test.com, Role: vendor
   - Should have roles: ['vendor']

3. **Admin Assigns Vendor Role to User**
   - GET /api/admin/users/{userId}/roles
   - PUT /api/admin/users/{userId}/assign-role (role: vendor)
   - Verify roles: ['user', 'vendor']

4. **Login with Different Roles**
   - Login as user role → activeRole: 'user'
   - Login as vendor role → activeRole: 'vendor'
   - Verify access to role-specific endpoints

5. **Access Control**
   - Vendor endpoint should reject user activeRole
   - User endpoint should reject vendor activeRole
   - Admin endpoints should reject non-admin activeRole

---

## Common Issues & Solutions

### Issue: Same email accessing vendor endpoints as user
**Solution**: Users now must select specific role during login. Even if they have 'vendor' role, they must log in with role='vendor' to access vendor endpoints.

### Issue: Cannot assign multiple roles
**Solution**: Users can be assigned multiple roles via admin API. Once assigned, they can log in with any of their assigned roles.

### Issue: User loses authorization after role change
**Solution**: Users need to log out and log back in to get a new token with the updated active role.

---

## Future Enhancements

1. Add role switching without re-login (refresh token with new activeRole)
2. Add role management UI for admins
3. Add audit logs for role changes
4. Add permission-based system (more granular than roles)
5. Add role expiration/time-based roles
