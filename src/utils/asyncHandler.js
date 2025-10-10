/*
  ASYNC HANDLER UTILITY
-------------------------
- Purpose: This utility is a higher-order function (func that takes another func as argument) designed to simplify error handling for asynchronous route handlers in Express.js. (controllers using async/await)

- Without this helper, every async route would need a try–catch block.  
This function automatically catches any errors and passes them to Express’s 
`next()` error-handling middleware — keeping the code clean and readable.

- Express expects error-handling middleware to be explicitly called using `next(err)`. Without this, uncaught async errors will crash the server.
*/

const asyncHandler = (requestHandler) => {

  /*
   Promise Resolution
  --------------------
  - `requestHandler` is the original async function (controller).
  - `Promise.resolve()` ensures that even if it doesn't return a promise explicitly, 
      it’s still treated as one.
  - If the promise is rejected (i.e., an error occurs), `.catch(next)` 
      forwards the error to Express’s built-in error handler.
  */

  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
  }
}

export { asyncHandler };







/*
 ALTERNATE ASYNC HANDLER (with direct error response)
------------------------------------------------------
🔹 Purpose:
A variation of the `asyncHandler` utility that directly sends an error response 
to the client instead of passing it to Express’s global error handler.

🔹 When to Use:
Use this version if there's no centralized error-handling middleware 
or you prefer each async route to handle its own response.

🔹 How It Works:
- Wraps any asynchronous function (`fn`) in a try–catch block.
- If an error occurs, it catches it and sends a standardized JSON response 
  with the error code and message.
*/

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//     await fn(req, res, next)
//   } catch (error) {
//     res.status(error.code || 500).json({
//       success: false,
//       message: error.message
//     })
//   }
// }