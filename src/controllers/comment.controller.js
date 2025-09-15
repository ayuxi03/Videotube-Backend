import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js"

const getVideoComments = asyncHandler ( async (req, res) => {
  const { videoId } = req.params;
  const { page = 1, limit = 10, sortType = "desc" } = req.query;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const comments = await Comment.aggregate([
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId)
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              fullName: 1,
              username: 1,
              avatar: 1,
            }
          }
        ]
      }
    },
    {
      $project: {
        content: 1,
        owner: { $first: "$ownerDetails" },
        createdAt: 1
      }
    },
    {
      $sort: {
        createdAt: sortType === "desc" ? -1 : 1
      }
    },
    {
      $skip: (page - 1) * parseInt(limit)
    },
    {
      $limit: parseInt(limit),
    }
  ])

  return res
    .status(200)
    .json(
      new ApiResponse(200, comments, comments.length ? "Video comments fetched successfully" : "No comments yet")
    )
})

const addComment = asyncHandler ( async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  if (!content || content.trim() === "") {
    throw new ApiError(400, "Content is required.");
  }

  const createdComment = await Comment.create({
    content,
    video: videoId,
    owner: req.user?._id
  })

  if (!createdComment) {
    throw new ApiError(500, "Comment could not be created")
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdComment, "Comment created successfully")
    )
})

const updateComment = asyncHandler( async (req, res) => {

})

const deleteComment = asyncHandler ( async (req, res) => {

})


export { getVideoComments, addComment, updateComment, deleteComment }