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

