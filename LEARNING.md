# CareerLens — Learning Journal

---

## TypeScript
### What I learned
- TypeScript is JavaScript with types
- Helps catch errors before running code
- Example:
```typescript
// JavaScript — no error until runtime
let name = "Minhaj"
name = 123 // no warning!

// TypeScript — error immediately
let name: string = "Minhaj"
name = 123 // ❌ Error: number not assignable to string
```

### Possible Interview Questions
Q: What is TypeScript and why use it?
A: TypeScript is a superset of JavaScript that adds static typing.
   It catches bugs at compile time instead of runtime, makes code
   more readable, and gives better IDE autocomplete support.

Q: What is the difference between interface and type in TypeScript?
A: Both define object shapes. Interface is better for objects and
   can be extended. Type is more flexible and can define unions.
   Example:
   interface User { name: string; age: number }
   type Status = "active" | "inactive" // only type can do this

---

## JWT Authentication
### What I learned
- JWT = JSON Web Token
- Used to verify who a user is after login
- Three parts: Header.Payload.Signature
- Flow:
  1. User logs in with email + password
  2. Server checks password is correct
  3. Server creates a JWT token and sends it back
  4. User sends token with every future request
  5. Server verifies token — if valid, allows access

### Possible Interview Questions
Q: What is JWT and how does it work?
A: JWT is a token used for authentication. After login, the server
   creates a signed token containing user data. The client stores
   this token and sends it with every request. The server verifies
   the signature to confirm the token is valid and hasn't been tampered with.

Q: Where should you store JWT on the frontend?
A: Best practice is httpOnly cookies — they can't be accessed by
   JavaScript so they're safe from XSS attacks. localStorage is
   common but less secure.

Q: What is the difference between authentication and authorization?
A: Authentication = who are you? (login)
   Authorization = what are you allowed to do? (permissions)

---

## MongoDB + Mongoose
### What I learned
- MongoDB stores data as documents (like JSON objects)
- Mongoose is a library that makes MongoDB easier to use in Node.js
- Schema defines the shape of your data
- Example schema:
```javascript
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true }
})
```

### Possible Interview Questions
Q: What is the difference between SQL and NoSQL?
A: SQL (like PostgreSQL) stores data in tables with fixed columns.
   NoSQL (like MongoDB) stores data as flexible documents.
   SQL is better for complex relationships.
   NoSQL is better for flexible, fast-changing data structures.

Q: What is Mongoose and why use it?
A: Mongoose is an ODM (Object Document Mapper) for MongoDB.
   It adds schemas, validation, and helper methods on top of
   raw MongoDB — making it much easier and safer to work with.

---

## Next.js
### What I learned
- Next.js is a React framework
- Adds file-based routing — each file in /app is a page
- Server side rendering built in — better for SEO
- app/page.tsx = homepage (localhost:3000)
- app/login/page.tsx = login page (localhost:3000/login)

### Possible Interview Questions
Q: What is the difference between Next.js and React?
A: React is a UI library — you build components.
   Next.js is a framework built on React that adds routing,
   server-side rendering, API routes, and optimizations
   out of the box.

Q: What is server side rendering (SSR)?
A: SSR means the page HTML is generated on the server before
   sending to the browser. This makes pages load faster and
   helps with SEO compared to client side rendering.

---

## Middleware
### What I learned
- Middleware is a function that runs between request and response
- Like a security guard — checks token before allowing access
- Uses next() to pass control to the next function
- Applied with app.use() or per route

### Possible Interview Questions
Q: What is middleware in Express?
A: Middleware is a function that has access to request, response,
   and the next function. It runs between receiving a request and
   sending a response. Common uses: authentication, logging, parsing.

Q: How does JWT authentication middleware work?
A: It extracts the token from the Authorization header, verifies it
   using the secret key, and if valid attaches the userId to the
   request object so the route handler can use it.

Q: What is the next() function in Express middleware?
A: next() passes control to the next middleware or route handler.
   If you don't call next(), the request will hang and never get
   a response.

## HTTP Status Codes
### What I learned
- 200 → OK (success)
- 201 → Created (new resource created)
- 400 → Bad Request (user sent wrong data)
- 401 → Unauthorized (not logged in)
- 403 → Forbidden (logged in but no permission)
- 404 → Not Found
- 500 → Server Error

### Possible Interview Questions
Q: What is the difference between 401 and 403?
A: 401 means the user is not authenticated (not logged in).
   403 means the user is authenticated but doesn't have
   permission to access that resource.

Q: What status code do you return when creating a new resource?
A: 201 Created — not 200. 200 is for successful GET requests.
   201 specifically means a new resource was created.

## bcrypt
### What I learned
- bcrypt is used to hash passwords before saving to database
- Hashing is one way — you cannot reverse it
- When login happens, bcrypt compares the input with the hash
- Salt rounds determine how strong the hash is (10 is standard)

### Possible Interview Questions
Q: Why do we hash passwords?
A: If the database is hacked, attackers get hashed passwords
   not real ones. Hashing is one-way so they cannot reverse it
   to get the original password.

Q: What is the difference between hashing and encryption?
A: Encryption is two-way — you can decrypt it back.
   Hashing is one-way — you cannot reverse it.
   Passwords should always be hashed, never encrypted.

   Q: What is async/await in JavaScript?
A: async/await is syntax for handling promises cleanly.
   await pauses execution until the promise resolves.
   Without it, code runs before the data arrives.

Q: What is useEffect in React?
A: useEffect runs code after the component renders.
   The empty [] dependency array means it runs once
   when the page first loads — perfect for fetching data.

Q: What is React state (useState)?
A: State is data that when changed, causes React to
   re-render the component automatically.
   setJobs(data) updates state → page re-renders with jobs.

   ## Next.js Routing
### What I learned
- Every file in app/ folder = a URL automatically
- app/login/page.tsx = localhost:3000/login
- No manual routing config needed

### Interview Questions
Q: How does routing work in Next.js?
A: File-based routing. Every page.tsx inside app/
   folder becomes a URL automatically.

Q: What is the difference between Link and router.push?
A: Link is for clickable navigation in JSX.
   router.push() is for programmatic redirect in code
   e.g. after login succeeds.

## useEffect + async/await
### What I learned
- useEffect runs code after component renders
- Empty [] means run once on page load
- await pauses until server responds
- Without await you get a Promise not real data

### Interview Questions
Q: What is useEffect used for?
A: Running side effects after render — fetching data,
   setting up subscriptions, updating the DOM.

Q: What happens if you forget await?
A: You get a Promise object instead of real data.
   setJobs(Promise) instead of setJobs([...jobs])

## set vs unordered_set
### What I learned
- set → sorted, O(log n) lookup, BST internally
- unordered_set → unsorted, O(1) lookup, HashMap internally
- Use unordered_set when you don't need order

### Interview Questions
Q: When would you use set over unordered_set?
A: When you need sorted data or need to iterate
   in order. Otherwise unordered_set is faster.

Q: What is the difference between map and set?
A: map stores key-value pairs.
   set stores keys only.
   Use set when you just need to track existence.

## Environment Variables
### What I learned
- Never hardcode URLs in your code
- Use environment variables for anything that changes
  between development and production
- In Next.js, prefix with NEXT_PUBLIC_ to use in browser
- Example:
  NEXT_PUBLIC_API_URL=http://localhost:8000/api

### Interview Questions
Q: Why use environment variables?
A: To separate config from code. URLs, API keys, secrets
   change between dev and production. Env vars make this
   easy to manage without changing code.

Q: What is the difference between .env and .env.example?
A: .env has real secret values — never commit to GitHub.
   .env.example shows what variables are needed with
   fake values — safe to commit so others know what to set.

## Input Validation
### What I learned
- Always validate user input on the backend
- Never trust data coming from frontend
- Check required fields exist before saving to database
- Return 400 Bad Request for invalid input

### Interview Questions
Q: Why validate on backend if you already validate frontend?
A: Frontend validation can be bypassed — anyone can send
   direct API requests with curl or Postman. Backend is
   the last line of defence.

Q: What HTTP status code for invalid input?
A: 400 Bad Request — means client sent wrong/missing data.

## TypeScript — char vs string
### What I learned
- In C++, single characters are char type not string
- unordered_map<char, int> for character counting
- unordered_map<string, int> for word counting
- auto it : s gives char when s is a string

### Interview Questions
Q: What is the difference between char and string in C++?
A: char is a single character — 1 byte.
   string is a sequence of characters.
   'a' is a char. "hello" is a string.

## Anagram Pattern
### What I learned
- Anagram = same letters, same count, any order
- One HashMap approach:
  count UP for string s
  count DOWN for string t
  if all zeros → anagram
- Early exit: if lengths differ → not anagram

### Interview Questions
Q: How to check anagram in O(n)?
A: One HashMap. Count up for s, count down for t.
   If all values zero → anagram.

Q: What is the space complexity of anagram check?
A: O(1) technically — only 26 letters in alphabet.
   Map never grows beyond 26 keys regardless of input size.