import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {

  /* 
  ------------------------------------------------------------
  STEP 1: Extract the authenticated user's ID (Channel Owner)
  ------------------------------------------------------------
  - `req.user?._id` comes from the authentication middleware (e.g., JWT verification).
  - This ensures the stats we fetch belong to the logged-in user only.
  */

  const userId = req.user?._id;
  
  /* ------------------------------------------------------------
     STEP 2: Fetch Total Videos and Subscribers (Parallel Execution)
     ------------------------------------------------------------
     - Using `Promise.all()` to run both MongoDB queries at once.
     - `Video.countDocuments({ owner: userId })` → counts all videos owned by this user.
     - `Subscription.countDocuments({ channel: userId })` → counts total subscribers to this user's channel.
     - Parallel querying improves performance (reduces total wait time).
  */

  const [ totalVideos, totalSubscribers ] = await Promise.all([
    Video.countDocuments({ owner: userId }),
    Subscription.countDocuments({ channel: userId })
  ])

  /* ------------------------------------------------------------
     STEP 3: Get All Owned Entity IDs (Videos, Tweets, Comments)
     ------------------------------------------------------------
     - Each `.distinct("_id")` returns an array of unique IDs for the documents owned by this user.
     - These IDs are later used to count likes efficiently (using `$in` queries).
     - Again, `Promise.all()` runs all three queries concurrently.
       Example:
         - videoIds = [vid1, vid2, vid3]
         - tweetIds = [tw1, tw2]
         - commentIds = [cmt1, cmt2, cmt3]
  */

  const [ videoIds, tweetIds, commentIds ] = await Promise.all([
    Video.find({ owner: userId }).distinct("_id"),
    Tweet.find({ owner: userId }).distinct("_id"),
    Comment.find({ owner: userId }).distinct("_id")
  ])

  /* ------------------------------------------------------------
     STEP 4: Count Total Likes for Each Content Type
     ------------------------------------------------------------
     - For each content type (Video, Tweet, Comment):
         → Check if the user owns any items (using `.length`).
         → If yes, count the number of Like documents where the content’s ID appears.
         → If no, skip the query and return 0 directly (for efficiency).
     - `$in: [array of IDs]` means “find all likes where the content ID is in this list.”
     - Using `Promise.all()` again for parallel execution.
     ------------------------------------------------------------
       Example:
         Suppose:
           - videoIds = [101, 102]
           - Likes collection contains:
               { video: 101 }, { video: 101 }, { video: 102 }
         => totalVideoLikes = 3
  */

  const [ totalVideoLikes, totalTweetLikes, totalCommentLikes ] = await Promise.all([
    videoIds.length ? Like.countDocuments({ video: { $in: videoIds } }) : 0,
    tweetIds.length ? Like.countDocuments({ tweet: { $in: tweetIds } }) : 0,
    commentIds.length ? Like.countDocuments({ comment: { $in: commentIds } }) : 0
  ])

  /* ------------------------------------------------------------
     STEP 5: Aggregate Total Views from All Videos
     ------------------------------------------------------------
     - Uses MongoDB Aggregation Pipeline:
         1. `$match` filters only videos owned by this user.
         2. `$group` with `_id: null` combines all into a single group.
         3. `$sum: "$views"` adds up the total view counts.
     - `new mongoose.Types.ObjectId(userId)` ensures correct type matching.
     - Returns an array like: [{ _id: null, totalViews: 12345 }]
     - Hence, `views[0]?.totalViews || 0` safely extracts the number.
  */

  const views = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $group: {
        _id: null,
        totalViews: { $sum: "$views" }
      }
    }
  ])

  // Send final response with all gathered stats

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          totalVideos,
          totalSubscribers,
          totalVideoLikes,
          totalTweetLikes,
          totalCommentLikes,
          totalViews: views[0]?.totalViews || 0 // Default to 0 if no views found
        },
        "Channel stats fetched successfully"
      )
    )
});



const getChannelVideos = asyncHandler(async (req, res) => {
  
  const userId = req.user?._id;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID");
  }

  /*
   Fetching All Videos Uploaded by the User (Channel Owner)
    -----------------------------------------------------------
    - We use `Video.find({ owner: userId })` to search for all videos where the `owner` field matches `userId`.
    - `userId` represents the currently logged-in user, meaning we are getting only THEIR videos.
  */

  const videos = await Video
    .find({ owner: userId })
    .sort({ createdAt: -1 }); // Sorting videos in descending order (newest first)

  return res
    .status(200)
    .json(
      new ApiResponse(200, videos, videos.length === 0 ? "No videos found" : "Videos fetched successfully")
    )
});


export { getChannelStats, getChannelVideos };