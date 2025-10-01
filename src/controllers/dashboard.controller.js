import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { isValidObjectId } from "mongoose";

const getChannelStats = asyncHandler(async (req, res) => {

});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.user?._id;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid Channel ID");
  }

  const videos = await Video
    .find({ channelId: channelId })
    .sort({ createdAt: -1 });
});


export { getChannelStats, getChannelVideos };