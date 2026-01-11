# API Centralization - Frontend Refactoring Summary

## Overview
All frontend-to-backend communication in the React job portal has been centralized into a single `api.js` module located at `src/utils/api.js`. This replaces scattered axios calls throughout the codebase with clean, reusable API functions.

## New API Module
**File**: `src/utils/api.js`

### Features:
- Centralized axios instance with base URL: `http://localhost:4000/api/v1`
- All requests include credentials by default
- Organized into logical endpoint groups:
  - **User Endpoints**: login, register, getUser, logout, forgotPassword, verifyOTP, resetPassword
  - **Job Endpoints**: getAllJobs, getJobById, getMyJobs, postJob, updateJob, deleteJob
  - **Application Endpoints**: getEmployerApplications, getJobSeekerApplications, postApplication, deleteApplication
  - **Visit Tracking Endpoints**: trackJobView, getVisitHistory, deleteVisitRecord

## Files Updated

### Authentication Components
1. **Login.jsx** - Uses `userLogin()` instead of axios.post
2. **Register.jsx** - Uses `userRegister()` instead of axios.post
3. **ForgotPassword.jsx** - Uses `forgotPassword()` instead of axios.post
4. **VerifyOTP.jsx** - Uses `verifyOTP()` instead of axios.post
5. **ResetPassword.jsx** - Uses `resetPassword()` instead of axios.post

### Core Components
6. **App.jsx** - Uses `getUser()` for fetching authenticated user data
7. **Navbar.jsx** - Uses `userLogout()` for logout functionality

### Job Management
8. **Jobs.jsx** - Uses `getAllJobs()` to fetch all available jobs
9. **JobDetails.jsx** - Uses `getJobById()` to fetch single job details
10. **PostJob.jsx** - Uses `postJob()` to create new job postings
11. **MyJobs.jsx** - Uses `getMyJobs()`, `updateJob()`, `deleteJob()` for job management

### Application Management
12. **Application.jsx** - Uses `postApplication()` to submit job applications
13. **MyApplications.jsx** - Uses `getEmployerApplications()`, `getJobSeekerApplications()`, `deleteApplication()`

### Utilities
14. **sessionManager.js** - Updated to use API functions from api.js

## Benefits

✅ **Single Source of Truth**: All API endpoints defined in one file
✅ **Easy Maintenance**: Update endpoint URLs in one place
✅ **Code Reusability**: Consistent API call patterns across the app
✅ **Error Handling**: Centralized error handling potential
✅ **Type Safety**: Easy to add TypeScript in future
✅ **Testing**: Mock API functions easily for unit tests
✅ **Configuration**: Easy to switch between dev/prod environments

## How to Use

### Example - Making an API Call
```javascript
import { userLogin } from "../../utils/api";

// Instead of:
// const { data } = await axios.post("http://localhost:4000/api/v1/user/login", {...})

// Now use:
const { data } = await userLogin(email, password, role);
```

## Verification
✓ Build completed successfully with no errors
✓ All imports are correctly configured
✓ All hardcoded URLs removed from components
✓ Base URL and credentials properly configured

## Next Steps (Optional)
- Add TypeScript interfaces for better type safety
- Add request/response interceptors for logging
- Add environment variables for API_BASE_URL
- Add retry logic for failed requests
- Add request caching strategy
