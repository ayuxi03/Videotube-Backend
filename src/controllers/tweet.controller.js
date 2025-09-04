import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Tweet } from "../models/tweet.models.js";
import { isValidObjectId } from "mongoose";

const createTweet = asyncHandler( async (req, res) => {
  const { content } = req.body;
  if (!content) {
    throw new ApiError(400, "Content is required");
  }

  const tweet = await Tweet.create({
    content,
    owner: req.user?._id
  })

  const createdTweet = await Tweet.findById(tweet._id);
  if (!createdTweet) {
    throw new ApiError(500, "Something went wrong while creating the tweet");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, createdTweet, "Tweet created successfully")
    )
})

const getUserTweets = asyncHandler( async (req, res) => {
  const { userId } = req.params;
  // console.log(userId);

  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const tweets = await Tweet
    .find({ owner: userId })
    .sort({ createdAt: -1 }); //to show the latest tweets first

  if (!tweets || tweets.length === 0) {
    throw new ApiError(404, "No tweets found for this user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, tweets, "User tweets fetched successfully")
    )
})

const updateTweet = asyncHandler( async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId || !content) {
    throw new ApiError(400, "Tweet Id and content required");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID")
  }

  const updatedTweet = await Tweet.findOneAndUpdate(
    {_id: tweetId, owner: req?.user._id},
    {content},
    {new: true}
  )

  if (!updatedTweet) {
    throw new ApiError(404, "Tweet not found or not authorized to update");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedTweet, "Tweet updated successfully")
    )
})

const deleteTweet = asyncHandler( async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "Tweet ID is required");
  }

  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid object ID");
  }

  const deletedTweet = await Tweet.findOneAndDelete(
    {
      _id: tweetId,
      owner: req.user?._id
    }
  )

  if (!deletedTweet) {
    throw new ApiError(404, "Tweet deletion failed or not authorized");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedTweet, "Tweet deleted successfully.")
    )
})

export { createTweet, getUserTweets, updateTweet, deleteTweet }