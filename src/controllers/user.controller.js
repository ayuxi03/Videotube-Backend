import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"

const registerUser = asyncHandler( async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for required files: images, avatar
  // upload them to cloudinary, check avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  const {fullName, email, username, password} = req.body
  console.log("email: ", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required")
    }

  // if (fullName === "") {
  //   throw new ApiError(400, "fullname is required")
  // }

});

export {registerUser}