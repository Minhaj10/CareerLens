# CareerLens — Progress Tracker

## May 16, 2026
### ✅ What I did today
- Set up Mac development environment
- Installed Node.js, MongoDB, Git, VS Code
- Created CareerLens project structure
- Set up Next.js frontend with TypeScript + Tailwind
- Built Express backend with TypeScript
- Created User model with MongoDB
- Built register and login API routes with JWT auth
- Tested API is running on port 5000

### ❌ Blockers
- Postman giving 403 — using curl instead

### 🎯 Tomorrow's Goal
- Fix API testing
- Start frontend login/register pages

---
## May 16, 2026
### ✅ What I did today
- Fixed API testing using curl
- Discovered Mac port 5000 was blocked by ControlCenter, moved to port 8000
- Built auth middleware to protect private routes
- Tested protected routes with and without JWT token
- Both register and login API routes working perfectly

### ❌ Blockers
- Port 5000 blocked by Mac ControlCenter — fixed by switching to 8000
- Postman giving 403 — switched to curl instead

### 🎯 Tomorrow's Goal
- Build Job model
- Build CRUD routes for jobs
- Test all job routes with curl

## May 19, 2026
### What I did today
- Built Job model with full TypeScript interface
- Built 4 CRUD routes — GET, POST, PUT, DELETE
- All routes protected with JWT auth middleware
- Tested all routes successfully with curl
- Solved LeetCode Two Sum — learned HashMap pattern
- Created DSA problem solving notebook

### Blockers
- curl multi-line commands breaking in terminal
- Fixed by running everything on one line

### Tomorrow's goal
- Start Next.js frontend
- Build login and register pages
- Connect frontend to backend API

## May 19, 2026
### ✅ What I did today
- Built login page with form validation
- Built register page connected to backend
- Built dashboard page showing all jobs
- Created lib/api.ts to handle all API calls
- Learned how Next.js routing works
- Learned how useEffect and async/await work
- Solved 3 LeetCode problems:
  - Two Sum #1 — HashMap pattern
  - Best Time to Buy and Sell Stock #121 — Greedy
  - Contains Duplicate #217 — unordered_set

### ❌ Blockers
- None today!

### 🎯 Tomorrow's Goal
- Add job form on dashboard
- User can add new job from frontend
- Style the dashboard better with Tailwind
-
## May 21, 2026
### ✅ What I did today
- Built Add Job form on dashboard
- Jobs now save from frontend to MongoDB instantly
- Fixed TypeScript error in server.ts (removed test route)
- Fixed frontend submodule git issue
- Added error handling and loading states
- Got code review — score 8.5/10
- Solved 2 LeetCode problems:
  - Valid Anagram #242 — HashMap char counting
  - Revised Contains Duplicate #217

### ❌ Blockers
- VS Code AI tool corrupted dashboard file — learned
  to always undo AI suggestions carefully
- Git submodule issue with frontend folder — fixed
  by removing frontend/.git

### 🎯 Tomorrow's Goal (Day 6)
- Add delete job functionality from frontend
- Add update job status from frontend
- Make dashboard look more polished
- LeetCode — Valid Palindrome #125

## May 23, 2026
### ✅ What I did today
- Fixed all Day 6 code review issues
- Added .env.example file
- Added delete confirmation popup
- Added input validation on backend
- Added email format validation on User model
- Added proper error handling in api.ts
- Built search and filter by status
- Built sort by date, salary, company
- Built edit job modal with all fields
- Added applied date picker
- Solved LeetCode Reverse String #344 — perfect solution!

### ❌ Blockers
- Uncontrolled input error on date field
  Fixed by adding default date in emptyForm

### 🎯 Tomorrow's Goal
- Start AI features — connect Claude API
- Build resume upload feature
- This is the most exciting part!