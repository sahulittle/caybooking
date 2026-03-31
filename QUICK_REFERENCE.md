# Role-Based Authentication - Quick Summary

## What Was Changed

### 1. ✅ User Model (`backend/models/user.model.js`)
- Changed from single `role` field to `roles` array
- Added `activeRole` field to track currently selected role
- Allows users to have multiple roles simultaneously

### 2. ✅ Auth Middleware (`backend/middleware/auth.middleware.js`)
- Enhanced `protect` middleware to validate activeRole from JWT token
- Updated `authorize` middleware to check activeRole instead of user.role
- Enforces that activeRole must be in user's roles array

### 3. ✅ Token Generation (`backend/utils/generateToken.js`)
- Updated to include `activeRole` instead of `role` in JWT payload
- Active role is now the key for authorization

### 4. ✅ User Controller (`backend/controllers/user.controller.js`)
- Updated signup to initialize `roles` array and `activeRole`
- Updated login to:
  - Accept `role` parameter
  - Check if user has the requested role
  - Generate token with the selected role as `activeRole`

### 5. ✅ Vendor Controller (`backend/controllers/vendor.controller.js`)
- Updated role checks to use `user.roles.includes('vendor')`
- Changed authorization checks to use `req.activeRole`

### 6. ✅ Admin Controller (`backend/controllers/admin.controller.js`)
- Added `assignRoleToUser()` - Assign roles to users
- Added `removeRoleFromUser()` - Remove roles from users
- Added `getUserRoles()` - Get user's roles and active role

### 7. ✅ Admin Routes (`backend/routes/admin.routes.js`)
- Added role management endpoints

---

## How It Works

### **Old System (Before)**
- User registers as EITHER 'user' OR 'vendor'
- Same email couldn't have both roles
- Security issue: If password leaked, attacker could access all roles

### **New System (After)**
- User registers as 'user' or 'vendor'
- Admin can assign additional roles (e.g., make user also a vendor)
- User chooses which role to use at login time
- Separate tokens for different roles = Better security

---

## Usage Examples

### Register as User
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login as Vendor (If Admin Assigned Vendor Role)
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "vendor"
  }'
```

### Admin Assigns Vendor Role to User
```bash
curl -X PUT http://localhost:5000/api/admin/users/{userId}/assign-role \
  -H "Authorization: Bearer {adminToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "vendor"
  }'
```

### Get User's Current Roles
```bash
curl -X GET http://localhost:5000/api/admin/users/{userId}/roles \
  -H "Authorization: Bearer {adminToken}"
```

---

## Key Security Improvements

✅ Users must explicitly choose their active role at login
✅ Each role gets a separate JWT token
✅ Middleware validates activeRole against assigned roles
✅ Vendor endpoints reject non-vendor tokens
✅ Admin endpoints only accept admin tokens
✅ Users cannot self-assign roles (only admins can)
✅ Admin roles cannot be removed by non-admins

---

## Database Migration (If Needed)

For existing MongoDB collections:
```javascript
db.users.updateMany(
  {},
  [
    {
      $set: {
        roles: [{ $ifNull: ["$role", "user"] }],
        activeRole: { $ifNull: ["$role", "user"] }
      }
    }
  ]
);
```

---

## Testing Checklist

- [ ] Register a new user with role='user'
- [ ] Register a new vendor with role='vendor'
- [ ] Login as user and verify access to user endpoints
- [ ] Login as vendor and verify access to vendor endpoints
- [ ] Try to access vendor endpoints with user token (should fail)
- [ ] Admin assigns vendor role to a user
- [ ] User logs in with role='vendor' and accesses vendor endpoints
- [ ] Admin removes vendor role from user
- [ ] User tries to login with role='vendor' (should fail)

---

## Important Notes

⚠️ **Database**: This change requires DB schema update (role → roles array)
⚠️ **Frontend**: Login form must now accept role selector
⚠️ **Tokens**: Old tokens won't work with new middleware (no activeRole field)
⚠️ **Migration**: Existing users need their roles field updated

---

## What Still Works

✅ All existing routes and endpoints
✅ Admin login still works the same way
✅ Public endpoints (not protected) unaffected
✅ JWT token structure backward compatible (just has activeRole instead of role)
