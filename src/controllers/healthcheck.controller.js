import {ApiResponse} from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const healthcheck = asyncHandler(async (_, res) => {

  /*  Health Check Endpoint
     -----------------------
     - Purpose: To confirm the API/server is up and running.
     - The underscore `_` is used instead of `req` since the request object isn’t needed here.
  */

  return res
    .status(200)
    .json(
      new ApiResponse(200, { status: "OK" }, "API is healthy")
    );
})

export { healthcheck };