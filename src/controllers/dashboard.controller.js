import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const userId = req.user?._id;

  const totalVideos = await Video.countDocuments({ owner: userId });

  const totalSubscribers = await Subscription.countDocuments({ channel: userId });

  const totalVideoLikes = await Like.countDocuments({ 
    video: {
      $in: await Video.find({ owner: userId }).distinct("_id")
    } 
  });

  const totalTweetLikes = await Like.countDocuments({ 
    tweet: {
      $in: await Tweet.find({ owner: userId }).distinct("_id")
    } 
  });

  const totalCommentLikes = await Like.countDocuments({ 
    comment: {
      $in: await Comment.find({ owner: userId }).distinct("_id")
    } 
  });
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const channelId = req.user?._id;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID");
  }

  const videos = await Video
    .find({ owner: channelId })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new ApiResponse(200, videos, videos.length === 0 ? "No videos found" : "Videos fetched successfully")
    )
});


export { getChannelStats, getChannelVideos };