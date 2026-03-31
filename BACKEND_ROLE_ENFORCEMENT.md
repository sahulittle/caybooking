# Backend Role Enforcement - Verification & Enhancement

## Current Backend Status ✅

Your backend already has role enforcement via:
1. `protect` middleware - validates JWT token
2. `authorize('role')` middleware - checks activeRole
3. All endpoints protected with required roles

## Verify Backend Is Properly Enforcing Roles

### Test 1: Verify Middleware Chain

**File**: `backend/routes/vendor.routes.js`
```javascript
// ✅ CORRECT - Pattern to follow
router.post('/create', protect, authorize('vendor'), createVendor);
//         ↑ Public path  ↑ Get user  ↑ Check role   ↑ Handler
```

Check all your routes follow this pattern:
- `protect` middleware runs first (verifies JWT)
- `authorize('role')` middleware runs second (checks activeRole)

### Test 2: Test Endpoint Directly

```bash
# Test 1: Call vendor endpoint with user token
TOKEN="user_token_here"
curl -X POST http://localhost:5000/api/vendors/create \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"businessName": "Test"}'

# Expected: ❌ 403 Forbidden
# Response: 
# {
#   "success": false,
#   "message": "Active role 'user' is not authorized to access this route"
# }
```

---

## Enhanced Backend Enforcement (Optional but Recommended)

### Add Audit Logging for Role Violations

**File**: `backend/middleware/roleAudit.middleware.js`

```javascript
import fs from 'fs';
import path from 'path';

/**
 * Audit middleware - Log all role-based access attempts and denials
 * Useful for security monitoring
 */
const auditRoleAccess = (req, res, next) => {
  const originalSend = res.send;

  res.send = function(data) {
    // Only log if this is a role-related response (403)
    if (res.statusCode === 403) {
      const auditLog = {
        timestamp: new Date().toISOString(),
        userId: req.user?._id || 'unknown',
        email: req.user?.email || 'unknown',
        attemptedRole: req.activeRole || 'unknown',
        userRoles: req.user?.roles || [],
        attemptedEndpoint: req.originalUrl,
        method: req.method,
        message: 'Role access denied',
        ipAddress: req.ip
      };

      // Log to file
      const logPath = path.join(process.cwd(), 'logs', 'role-violations.log');
      fs.appendFileSync(
        logPath,
        JSON.stringify(auditLog) + '\n'
      );

      console.warn('⚠️ Role Violation:', auditLog);
    }

    res.send = originalSend;
    return res.send(data);
  };

  next();
};

export { auditRoleAccess };
```

Add to your routes:
```javascript
// backend/routes/vendor.routes.js
import { auditRoleAccess } from '../middleware/roleAudit.middleware.js';

router.use(auditRoleAccess);  // Add this line
```

---

## Backend Verification Checklist

### ✅ Check All Protected Routes

```javascript
// ✅ GOOD - Vendor endpoints protected
router.post('/create', protect, authorize('vendor'), createVendor);
router.get('/:id', protect, authorize('vendor', 'admin'), getVendor);

// ✅ GOOD - Admin endpoints protected
router.get('/users', protect, authorize('admin'), getAllUsers);
router.put('/users/:id/assign-role', protect, authorize('admin'), assignRole);

// ✅ GOOD - User endpoints protected
router.get('/profile', protect, authorize('user'), getUserProfile);
```

### 🔴 Check for Unprotected Endpoints

```javascript
// ❌ BAD - Public access (intentional for listing)
router.get('/vendors', getAllVendors);  // OK - just listing

// ❌ BAD - Missing authorize middleware
router.post('/create', protect, createVendor);  // Should have authorize('vendor')

// ❌ BAD - Missing protect middleware
router.put('/:id', updateVendor);  // Should have protect
```

---

## Test Endpoint Protection

### Create Test Script

**File**: `backend/tests/roleProtection.test.js`

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Test data
let userToken = '';
let vendorToken = '';
let adminToken = '';

// Get a user token
const getUserToken = async () => {
  const res = await axios.post(`${API_URL}/api/login`, {
    email: 'user@test.com',
    password: 'password123',
    role: 'user'
  });
  return res.data.token;
};

// Get a vendor token
const getVendorToken = async () => {
  const res = await axios.post(`${API_URL}/api/login`, {
    email: 'vendor@test.com',
    password: 'password123',
    role: 'vendor'
  });
  return res.data.token;
};

// Get admin token
const getAdminToken = async () => {
  const res = await axios.post(`${API_URL}/api/login`, {
    email: 'admin@cayman.com',
    password: process.env.ADMIN_PASSWORD,
    role: 'admin'
  });
  return res.data.token;
};

// Test: User cannot create vendor profile
const testUserCannotCreateVendor = async () => {
  console.log('Testing: User cannot create vendor profile...');
  try {
    await axios.post(`${API_URL}/api/vendors/create`, 
      { businessName: 'Test' },
      { headers: { Authorization: userToken } }
    );
    console.error('❌ FAILED: User was able to create vendor profile!');
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✅ PASSED: User blocked from creating vendor profile');
    } else {
      console.error('❌ FAILED: Wrong error:', error.message);
    }
  }
};

// Test: Vendor can create vendor profile
const testVendorCanCreateVendor = async () => {
  console.log('Testing: Vendor can create vendor profile...');
  try {
    await axios.post(`${API_URL}/api/vendors/create`,
      {
        businessName: 'Test Vendor',
        serviceType: 'plumbing',
        phone: '1234567890'
      },
      { headers: { Authorization: vendorToken } }
    );
    console.log('✅ PASSED: Vendor able to create vendor profile');
  } catch (error) {
    console.error('❌ FAILED:', error.response?.data?.message);
  }
};

// Test: Vendor cannot access admin endpoints
const testVendorCannotAccessAdmin = async () => {
  console.log('Testing: Vendor cannot access admin endpoints...');
  try {
    await axios.get(`${API_URL}/api/admin/users`,
      { headers: { Authorization: vendorToken } }
    );
    console.error('❌ FAILED: Vendor was able to access admin endpoints!');
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✅ PASSED: Vendor blocked from admin endpoints');
    } else {
      console.error('❌ FAILED: Wrong error:', error.message);
    }
  }
};

// Test: Admin can access all endpoints
const testAdminCanAccessAll = async () => {
  console.log('Testing: Admin can access all endpoints...');
  try {
    await axios.get(`${API_URL}/api/admin/users`,
      { headers: { Authorization: adminToken } }
    );
    console.log('✅ PASSED: Admin able to access admin endpoints');
  } catch (error) {
    console.error('❌ FAILED:', error.response?.data?.message);
  }
};

// Run all tests
const runTests = async () => {
  console.log('🔒 Starting Role Protection Tests...\n');

  try {
    userToken = await getUserToken();
    vendorToken = await getVendorToken();
    adminToken = await getAdminToken();

    await testUserCannotCreateVendor();
    await testVendorCanCreateVendor();
    await testVendorCannotAccessAdmin();
    await testAdminCanAccessAll();

    console.log('\n✅ Tests completed!');
  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
  }
};

runTests();
```

Run with:
```bash
node backend/tests/roleProtection.test.js
```

---

## Backend Routes Verification

### Verify All Routes Use StrictProtections

Check `backend/routes/`:

**vendor.routes.js** - Should look like:
```javascript
✅ router.post('/create', protect, authorize('vendor'), createVendor);
✅ router.get('/:id', getAllVendors);  // Public
✅ router.put('/:id', protect, authorize('vendor', 'admin'), updateVendor);
✅ router.delete('/:id', protect, authorize('admin'), deleteVendor);
```

**admin.routes.js** - Should look like:
```javascript
router.use(protect, authorize('admin'));  // All routes require admin

✅ router.get('/users', getAllUsersAdmin);
✅ router.get('/users/:id/roles', getUserRoles);
✅ router.put('/users/:id/assign-role', assignRoleToUser);
```

**user.routes.js** - Should look like:
```javascript
✅ router.post('/signup', signupUser);  // Public
✅ router.post('/login', loginUser);    // Public
✅ router.get('/users', protect, authorize('admin'), getAllUsers);
```

---

## Additional Backend Security Measures

### 1. Add Rate Limiting for Failed Login Attempts

**File**: `backend/middleware/rateLimiter.middleware.js`

```javascript
import rateLimit from 'express-rate-limit';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per windowMs
  message: 'Too many login attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

export { loginLimiter };
```

Add to routes:
```javascript
import { loginLimiter } from '../middleware/rateLimiter.middleware.js';

router.post('/login', loginLimiter, loginUser);
```

### 2. Add CORS Restriction by Role

**File**: `backend/middleware/corsRole.middleware.js`

```javascript
const corsWithRole = (req, res, next) => {
  const origin = req.get('origin');
  const allowedOrigins = {
    'http://localhost:3000': ['user', 'vendor', 'admin'],
    'https://caymantenance.com': ['user', 'vendor', 'admin'],
    'https://admin.caymantenance.com': ['admin'],
    'https://vendor.caymantenance.com': ['vendor']
  };

  const allowedRoles = allowedOrigins[origin];
  
  if (allowedRoles && allowedRoles.includes(req.activeRole)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  next();
};

export { corsWithRole };
```

### 3. Add Session Tracking (Optional)

```javascript
// backend/middleware/sessionTracking.middleware.js
const sessionTracking = async (req, res, next) => {
  const userId = req.user?._id;
  const role = req.activeRole;
  const sessionId = req.headers['x-session-id'];

  if (userId && role) {
    // Optional: Log active sessions per user per role
    console.log(`User ${userId} active as ${role} in session ${sessionId}`);
  }

  next();
};
```

---

## Deployment Checklist

- [ ] All vendor routes have `authorize('vendor')`
- [ ] All admin routes have `authorize('admin')`  
- [ ] All user routes have `authorize('user')`
- [ ] Rate limiting configured on login endpoint
- [ ] CORS properly configured
- [ ] Test script passes all tests
- [ ] Error logging configured
- [ ] Audit logging in place (optional)
- [ ] Database indexes on roles field
- [ ] No hardcoded test credentials in production

---

## Monitor Role Violations

Check logs for security issues:

```bash
# View role violation logs
tail -f logs/role-violations.log

# Count violations
grep -c "Role access denied" logs/role-violations.log

# Users with most violations
grep "Role access denied" logs/role-violations.log | \
  grep -o '"email":"[^"]*"' | sort | uniq -c | sort -rn
```

---

## Summary

Your backend is already properly enforcing role-based access. The key protections are:

1. ✅ JWT token contains `activeRole`
2. ✅ Middleware validates `activeRole` against role array
3. ✅ Routes check `authorize('role')`
4. ✅ All responses are consistent

The frontend implementation ensures users cannot even attempt to access wrong roles, adding an additional layer of security.

**Result**: Complete role-based access control with no cross-role access possible.
