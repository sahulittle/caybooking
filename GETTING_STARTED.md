# Getting Started - Role-Based Authentication

## 🚀 Quick Start Guide

This guide will help you test and deploy the new role-based authentication system.

---

## Phase 1: Database Setup (Choose One)

### Option A: Fresh Database (New Project)
No migration needed. Users will automatically get the new schema when they register.

### Option B: Existing Database (Existing Users)

Run this MongoDB query to migrate existing users:

```javascript
// Connect to your MongoDB database and run:
db.users.updateMany(
  { roles: { $exists: false } },
  [
    {
      $set: {
        roles: [{ $cond: [{ $eq: ["$role", null] }, "user", "$role"] }],
        activeRole: { $cond: [{ $eq: ["$role", null] }, "user", "$role"] }
      }
    }
  ]
);
```

---

## Phase 2: Backend Testing

### Start the Backend Server
```bash
cd backend
npm install  # If needed
npm start
```

### Test 1: Register as User
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John User",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John User",
    "email": "john@example.com",
    "roles": ["user"],
    "activeRole": "user"
  }
}
```

### Test 2: Login as User
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Test 3: Register as Vendor
```bash
curl -X POST http://localhost:5000/api/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Vendor",
    "email": "jane@example.com",
    "password": "password123",
    "role": "vendor"
  }'
```

### Test 4: Admin Login
```bash
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@cayman.com",
    "password": "your_admin_password",
    "role": "admin"
  }'
```

### Test 5: Try Invalid Role Login
```bash
# User "john" trying to login as vendor (should fail if he wasn't assigned vendor role)
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "vendor"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "This role is not assigned to your account. Your roles: user"
}
```

### Test 6: Admin Assigns Vendor Role
```bash
# First get the user ID, then:
curl -X PUT http://localhost:5000/api/admin/users/{userId}/assign-role \
  -H "Authorization: Bearer {adminToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "role": "vendor"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Role 'vendor' assigned to user",
  "user": {
    "id": "...",
    "name": "John User",
    "email": "john@example.com",
    "roles": ["user", "vendor"],
    "activeRole": "user"
  }
}
```

### Test 7: User Now Logs in as Vendor
```bash
# John now tries to login as vendor (should succeed after role assignment)
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "role": "vendor"
  }'
```

---

## Phase 3: Test Protected Routes

### Test Access Control: Vendor Endpoint
```bash
# User token (logged in as user)
curl -X POST http://localhost:5000/api/vendors/create \
  -H "Authorization: Bearer {userToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "John Services",
    "serviceType": "plumbing",
    "experience": 5,
    "location": "Downtown",
    "phone": "1234567890",
    "description": "Professional plumber"
  }'
```

**Expected Response:** ❌ 403 Forbidden
```json
{
  "success": false,
  "message": "Active role 'user' is not authorized to access this route"
}
```

### Test with Vendor Token
```bash
# Vendor token (logged in as vendor)
curl -X POST http://localhost:5000/api/vendors/create \
  -H "Authorization: Bearer {vendorToken}" \
  -H "Content-Type: application/json" \
  -d '{
    "businessName": "Jane Services",
    "serviceType": "plumbing",
    "experience": 5,
    "location": "Downtown",
    "phone": "1234567890",
    "description": "Professional plumber"
  }'
```

**Expected Response:** ✅ 201 Created

---

## Phase 4: Frontend Integration

### Step 1: Update API Client
Edit `frontend/src/api/apiClient.js` to include token in requests:

```javascript
// Add interceptor to include Bearer token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  }
)
```

### Step 2: Update Login Component
Edit `frontend/src/components/Login.jsx`:

```javascript
// Add role selector to form
<select 
  value={selectedRole}
  onChange={(e) => setSelectedRole(e.target.value)}
  className="..."
>
  <option value="user">User</option>
  <option value="vendor">Vendor</option>
</select>

// Update handleLogin to call API and store token
const response = await axios.post('http://localhost:5000/api/login', {
  email,
  password,
  role: selectedRole
});

localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));
```

### Step 3: Update Protected Routes
Edit `frontend/src/routes/ProtectedRoute.jsx`:

```javascript
const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && !user.roles?.includes(requiredRole)) {
    return <Navigate to="/" />;
  }

  return children;
};
```

### Step 4: Use Protected Routes in App
```javascript
<Routes>
  <Route path="/vendor/dashboard" element={
    <ProtectedRoute requiredRole="vendor">
      <VendorDashboard />
    </ProtectedRoute>
  } />
</Routes>
```

---

## Phase 5: Verification Checklist

### Backend Verification
- [ ] User registers as 'user' - roles: ['user'] ✓
- [ ] User registers as 'vendor' - roles: ['vendor'] ✓
- [ ] Login with correct role - success ✓
- [ ] Login with wrong role - 403 error ✓
- [ ] Admin can assign roles ✓
- [ ] User can access vendor endpoints after role assignment ✓
- [ ] Vendor endpoints reject user tokens ✓
- [ ] Admin endpoints reject non-admin tokens ✓

### Frontend Verification
- [ ] Login form shows role selector ✓
- [ ] Login stores token in localStorage ✓
- [ ] Protected routes check token ✓
- [ ] User redirected to login if token missing ✓
- [ ] User redirected if lacks required role ✓
- [ ] Navigation updates based on activeRole ✓

---

## Phase 6: Common Issues & Fixes

### Issue: "Not authorized, no token"
**Cause**: API not receiving token in Authorization header
**Fix**: 
```javascript
// Ensure API client sends token
const token = localStorage.getItem('token');
headers.Authorization = token; // Should be "Bearer ..."
```

### Issue: "Invalid role in token"
**Cause**: User's roles array doesn't match activeRole in token
**Fix**: Clear localStorage and re-login to get fresh token

### Issue: User can't select vendor role in login
**Cause**: Frontend login form doesn't have role selector
**Fix**: Add role dropdown to login form (see Phase 4, Step 2)

### Issue: Token not stored in localStorage
**Cause**: Signup/Login not storing token response
**Fix**: 
```javascript
localStorage.setItem('token', response.data.token);
```

### Issue: 403 Forbidden on vendor endpoints
**Cause**: User doesn't have vendor role or logged in as user
**Fix**: 
1. Admin assigns vendor role via admin API
2. User logs out and logs back in, selecting "vendor" role

---

## Phase 7: Production Deployment

### Pre-Deployment Checklist
- [ ] Environment variables set (.env file)
- [ ] Database migrated (if existing users)
- [ ] All backend tests passing
- [ ] Frontend components updated
- [ ] SSL/HTTPS configured
- [ ] CORS settings correct
- [ ] Rate limiting implemented

### Deployment Steps
```bash
# Backend
cd backend
npm install
npm start (or use process manager like PM2)

# Frontend
cd frontend
npm install
npm run build
npm run preview (or serve with nginx/apache)
```

### Post-Deployment Verification
- [ ] Signup works
- [ ] Login with role selection works
- [ ] Protected routes restricted correctly
- [ ] Admin can manage roles
- [ ] No console errors

---

## Quick Reference: Key Endpoints

### Auth
- `POST /api/signup` - Register with role
- `POST /api/login` - Login with role selection

### Admin Only
- `GET /api/admin/users` - List users
- `GET /api/admin/users/:id/roles` - Get user roles
- `PUT /api/admin/users/:id/assign-role` - Assign role
- `PUT /api/admin/users/:id/remove-role` - Remove role

### Vendor Only
- `POST /api/vendors/create` - Create vendor profile
- `PUT /api/vendors/:id` - Update vendor profile

### Public
- `GET /api/vendors` - List vendors
- `GET /api/vendors/:id` - Get vendor details

---

## Need Help?

Refer to:
- ✅ `IMPLEMENTATION_SUMMARY.md` - Overview of all changes
- ✅ `ROLE_BASED_AUTH.md` - Comprehensive API documentation
- ✅ `QUICK_REFERENCE.md` - Quick reference guide
- ✅ `FRONTEND_INTEGRATION.md` - Frontend integration details

---

## Next Steps

1. **Run Phase 1**: Set up database
2. **Run Phase 2**: Test backend endpoints
3. **Run Phase 3**: Verify access control
4. **Run Phase 4**: Update frontend
5. **Run Phase 5**: Verify everything works
6. **Deploy**: Push to production

Good luck! 🚀
