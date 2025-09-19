import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike = asyncHandler ( async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID")
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user?._id
  })

  if (existingLike) {
    await Like.findByIdAndDelete({
      _id: existingLike._id
    })
    
    return res
      .status(200)
      .json(
        new ApiResponse(200, existingLike, "Video unliked successfully")
      )
  }

  const newLike = await Like.create({
    video: videoId,
    likedBy: req.user?._id
  })

  if (!newLike) {
    throw new ApiError(500, "Failed to like video")
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, newLike, "Video liked successfully")
    )
})


const toggleCommentLike = asyncHandler ( async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID")
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user?._id
  })

  if (existingLike) {
    await Like.findByIdAndDelete({
      _id: existingLike._id
    })
    
    return res
      .status(200)
      .json(
        new ApiResponse(200, existingLike, "Comment unliked successfully")
      )
  }

  const newLike = await Like.create({
    comment: commentId,
    likedBy: req.user?._id
  })

  if (!newLike) {
    throw new ApiError(500, "Failed to like comment")
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, newLike, "Comment liked successfully")
    )
})


const toggleTweetLike = asyncHandler ( async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID")
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user?._id
  })

  if (existingLike) {
    await Like.findByIdAndDelete({
      _id: existingLike._id
    })
    
    return res
      .status(200)
      .json(
        new ApiResponse(200, existingLike, "Tweet unliked successfully")
      )
  }

  const newLike = await Like.create({
    tweet: tweetId,
    likedBy: req.user?._id
  })

  if (!newLike) {
    throw new ApiError(500, "Failed to like tweet")
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, newLike, "Tweet liked successfully")
    )
})


const getLikedVideos = asyncHandler ( async (req, res) => {

  const likedVideos = await Like.find({
    likedBy: req.user?._id,
    video: { $exists: true }
  }).populate("video", "_id title videoFile thumbnail")

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        likedVideos,
        likedVideos.length === 0 ? "No liked videos" : "Liked videos fetched successfully")
    )
})

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos }