/*
 ApiError Utility Class
------------------------
👉 Purpose:
   - To create custom error objects for handling API errors in a structured way.
   - Extends the built-in `Error` class in JavaScript for better error management.
*/

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message) // Call the parent Error constructor with the message

    // 🔹 Attach custom properties for API error responses
    this.statusCode = statusCode // HTTP status code (e.g., 404, 500)
    this.data = null // No data since this is an error response
    this.message = message // Error message
    this.success = false; // Always false for errors
    this.errors = errors // Array of specific error details

    // ⚙️ Stack Trace Handling
    if (stack) {
      // Use provided stack trace if available
      this.stack = stack
    } else {
      // Capture stack trace automatically for debugging
      Error.captureStackTrace(this, this.constructor)

    }
  }
}

export { ApiError }

/*
💡 Why use a custom ApiError class?
  - Makes error responses consistent across all routes.
  - Easier to handle specific error types (e.g., validation, authentication).
  - Helps developers debug with clear stack traces.
*/