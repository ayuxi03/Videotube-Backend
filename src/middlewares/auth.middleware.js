import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

/*
👉 JWT Verification Middleware
--------------------------------
- Ensures only authenticated users can access protected routes.
- Extracts the token from cookies or Authorization header.
- Verifies and decodes it using the secret key.
- Fetches the user (excluding password & refresh token).
- If valid → attaches user to req.
- If invalid or missing → throws 401 Unauthorized.
*/

export const verifyJWT = asyncHandler( async (req, _, next) => { // _ used in place of res bcoz res not used
  try {
    
    // Extract token from cookies or "Authorization: Bearer <token>" header
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer  ", "")
  
    if (!token) {
      throw new ApiError(401, "Unauthorized request")
    }
  
    /* 
    - Verify & decode the token
    - If invalid/expired, jwt.verify() will throw an error */
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) 
    
    // Fetch the user by ID from the decoded token (exclude sensitive fields)
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
  
    if (!user) {
      // Discuss frontend
      throw new ApiError(401, "Invalid access token")
    }
    
    // Attach the user to the request object for downstream access
    req.user = user;
    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }

})