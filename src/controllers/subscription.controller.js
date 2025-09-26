import { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
// import { User } from "../models/user.model.js";

const toggleSubscription = asyncHandler ( async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  if (channelId.toString() === req.user?._id.toString()) {
    throw new ApiError(400, "You cannot subscribe to your own channel");
  }

  const existingSubscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user?._id
  })

  if (existingSubscription) {
    await Subscription.findByIdAndDelete(
      existingSubscription._id
    )

    return res
      .status(200)
      .json(
        new ApiResponse(200, existingSubscription, "Unsubscribed successfully")
      )
  }

  const newSubscription = await Subscription.create({
    channel: channelId,
    subscriber: req.user?._id
  })

  if (!newSubscription) {
    throw new ApiError(500, "Failed to subscribe");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, newSubscription, "Subscribed successfully")
    );
})

const getUserSubscriptions = asyncHandler ( async (req, res) => {

})

const getUserChannelSubscribers = asyncHandler ( async (req, res) => {

})

export { toggleSubscription, getUserSubscriptions, getUserChannelSubscribers }