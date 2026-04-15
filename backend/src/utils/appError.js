class AppError extends Error{
    constructor(message,statusCode){
        super(message)

        this.message=message;
        this.statusCode=statusCode;
        this.status=`${this.statusCode}`.startsWith("4")?'Fail':'Error'
        this.isOperational=true;

        Error.captureStackTrace(this,this.constructor)
    }

}

export default AppError;






// 🔍 1. class AppError extends Error
// ✅ What it does
// Creates a custom error class
// Inherits from the built-in Error class
// 🧠 Internals

// JavaScript has a built-in prototype chain:

// AppError → Error → Object

// So your class automatically gets:

// message
// stack
// name
// 🎯 Why extend Error?

// So your error behaves like a real error object, not just a plain object.

// 🔍 2. constructor(message, statusCode)
// ✅ What it does
// Runs when you create a new error:
// new AppError('User not found', 404)
// 📦 Parameters
// message → human-readable error
// statusCode → HTTP status (e.g., 404, 500)

// 🔍 3. super(message)
// ✅ What it does
// Calls the parent (Error) constructor
// 🧠 Internals

// This sets:

// this.message = message

// and also initializes:

// this.stack
// this.name
// ⚠️ Important

// You must call super() before using this in a subclass.

// 🔍 4. this.statusCode = statusCode
// ✅ What it does
// Stores HTTP status code inside the error object
// 📌 Example
// err.statusCode // 404
// 🎯 Why useful?

// Your global error handler can use it:

// res.status(err.statusCode)

// 🔍 5. this.status = \${statusCode}`.startsWith('4') ? 'fail' : 'error'`
// ✅ What it does
// Converts status code into a category
// 🧠 Step-by-step breakdown
// Step 1: Convert number → string
// `${statusCode}`  // "404"
// Step 2: Check first digit
// "404".startsWith('4') // true
// Step 3: Assign label

// 4xx → "fail" (client error)
// others → "error" (server error)
// 🎯 Result
// Status Code	status
// 404	fail
// 400	fail
// 500	error
// 503	error
// 💡 Why this matters

// Helps differentiate:

// {
//   "status": "fail",   // user mistake
//   "message": "Invalid input"
// }

// vs

// {
//   "status": "error",  // server issue
//   "message": "Something went wrong"
// }

// 🔍 6. this.isOperational = true
// ✅ What it does
// Marks this error as expected / handled
// 🧠 Concept: Operational vs Programming Errors
// ✅ Operational errors (safe)
// Invalid input
// Not found
// Unauthorized
// ❌ Programming errors (bugs)
// undefined variables
// null pointer errors
// logic mistakes
// 🎯 Why this flag matters

// In production, you might do:

// if (err.isOperational) {
//     res.json({ message: err.message })
// } else {
//     // unknown bug → don't expose details
//     res.json({ message: 'Something went wrong' })
// }

// 🔍 7. Error.captureStackTrace(this, this.constructor)
// ✅ What it does
// Creates a clean stack trace
// 🧠 What is a stack trace?

// It shows where the error happened:

// Error: User not found
//     at getUser (/controllers/user.js:10)
//     at processRequest ...
// 🔧 Why use captureStackTrace?
// Without it:

// Stack includes constructor noise:

// at new AppError (...)
// With it:

// Removes constructor from stack → cleaner debugging

// ⚙️ Arguments explained
// Error.captureStackTrace(targetObject, constructorToExclude)
// this → attach stack to this object
// this.constructor → exclude this constructor from trace

// 🔍 8. export default AppError
// ✅ What it does
// Makes this class available in other files
// 📦 Usage
// import AppError from './utils/AppError.js'

// throw new AppError('User not found', 404)

// 🧠 Putting It All Together
// Example object created:
// const err = new AppError('User not found', 404)
// Result:
// {
//   message: "User not found",
//   statusCode: 404,
//   status: "fail",
//   isOperational: true,
//   stack: "Error: User not found\n    at ..."
// }
// 🔄 How It Flows in Express
// Controller → throw AppError
//         ↓
// catchAsync → catches error
//         ↓
// next(err)
//         ↓
// Global Error Middleware
//         ↓
// Response sent to client

// 🧩 Mental Model (Visual)
//         AppError
//            │
//            ▼
//      inherits Error
//            │
//            ▼
//   Adds custom properties
//   ├── statusCode
//   ├── status
//   ├── isOperational
//   └── clean stack
// ✅ Summary
// extends Error → inherit native error behavior
// super(message) → sets core error fields
// statusCode → HTTP response control
// status → categorize error
// isOperational → safe vs bug distinction
// captureStackTrace → cleaner debugging

// If you want next, I can show:

// How Node internally builds the error stack
// Real production-grade error handler (dev vs prod modes)
// Handling database-specific errors (like Mongoose) using this class