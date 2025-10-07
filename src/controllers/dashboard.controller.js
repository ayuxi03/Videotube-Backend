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
  // Extract the authenticated user's ID (the channel owner)
  const userId = req.user?._id;

  const [ totalVideos, totalSubscribers ] = await Promise.all([
    Video.countDocuments({ owner: userId }),
    Subscription.countDocuments({ channel: userId })
  ])

  const [ videoIds, tweetIds, commentIds ] = await Promise.all([
    Video.find({ owner: userId }).distinct("_id"),
    Tweet.find({ owner: userId }).distinct("_id"),
    Comment.find({ owner: userId }).distinct("_id")
  ])

  const [ totalVideoLikes, totalTweetLikes, totalCommentLikes ] = await Promise.all([
    videoIds.length ? Like.countDocuments({ video: { $in: videoIds } }) : 0,
    tweetIds.length ? Like.countDocuments({ tweet: { $in: tweetIds } }) : 0,
    commentIds.length ? Like.countDocuments({ comment: { $in: commentIds } }) : 0
  ])

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
          totalViews: views[0]?.totalViews || 0
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