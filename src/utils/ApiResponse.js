/*
 ApiResponse Utility Class
---------------------------
👉 Purpose:
  - To create a consistent and standardized structure for all API responses.
  - Makes it easier to manage success and error responses across the backend.
*/

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode // HTTP status code sent to client
    this.data = data // The actual response body or payload (object, array, etc.)
    this.message = message // Short message for clarity
    this.success = statusCode < 400 // // Boolean flag → true if response is successful (2xx, 3xx), false for errors (4xx, 5xx)
  }
}

export { ApiResponse }