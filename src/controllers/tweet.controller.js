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
    .status(201)
    .json(
      new ApiResponse(201, createdTweet, "Tweet created successfully")
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

  // Check if tweet exists
  
  // const tweet = await Tweet.findById(tweetId);
  // if (!tweet) {
  //   throw new ApiError(404, "Tweet not found");
  // }


  // Check if user owns the tweet

  // if (tweet.owner.toString() !== userId.toString()) {
  //   throw new ApiError(403, "You can only delete your own tweets");
  // }

  // Delete the tweet. This method does not check for ownership. Beginner's approach. Easy to catch specific errors

  // const deletedTweet = await Tweet.findByIdAndDelete(tweetId);
  // if (!deletedTweet) {
  //   throw new ApiError(500, "Something went wrong while deleting a tweet");
  // }

  // Delete the tweet. Industry standard is to use findOneAndDelete
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