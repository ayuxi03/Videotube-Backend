import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler (async (req, res) => {
  const { page = 1, limit = 10, query, sortBy="createdAt", sortType="desc", userId } = req.query;

  if (!req.user) {
    throw new ApiError(401, "User needs to be logged in");
  }

  const match = {
    ...(query ? { title: { $regex: query, $options: "i" } } : {}),
    ...(userId ? { owner: mongoose.Types.ObjectId(userId) } : {}),
    ...(req.user?._id.toString() !== userId ? { isPublished: true } : {}), // only show published if owner != logged-in user, i.e., logged in user can see their own unpublished videos
  }

  const videos = await Video.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "videosByOwner",
      },
    },
    {
      $project: {
        videoFile: 1,
        title: 1,
        description: 1,
        thumbnail: 1,
        duration: 1,
        views: 1,
        isPublished: 1,
        owner: { $arrayElemAt: ["videosByOwner", 0] } // Extracts the first user object from the array
      },
    },
    {
      $sort: {
        [sortBy]: sortType === "desc" ? -1 : 1,
      },
    },
    {
      $skip: (page - 1) * parseInt(limit)
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  if (!videos?.length) {
    throw new ApiError(404, "Videos not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, videos, "Videos fetched successfully")
    )
})



const publishVideo = asyncHandler (async (req, res) => {
  const { title, description } = req.body;
  const videoLocalPath = req.files?.videoFile[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;

  if (!title || !description) {
    throw new ApiError(400, "Title and description are required");
  }

  if (!videoLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video and thumbnail file are required");
  }

  const [ videoFile, thumbnail ] = await Promise.all([
    uploadOnCloudinary(videoLocalPath),
    uploadOnCloudinary(thumbnailLocalPath)
  ]);

  // const videoFile = await uploadOnCloudinary(videoLocalPath);
  if (!videoFile?.url) {
    throw new ApiError(500, "Failed to upload video");
  }

  // const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
  if (!thumbnail?.url) {
    throw new ApiError(500, "Failed to upload thumbnail");
  }

  const newVideo = await Video.create({
    title,
    description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: videoFile.duration,
    owner: req.user?._id
  });

  console.log(`Title: ${title}, Description: ${description}, Owner: ${req.user?._id}, Duration: ${videoFile.duration}, Video URL: ${videoFile.url}, Thumbnail URL: ${thumbnail.url}`);

  if (!newVideo) {
    throw new ApiError(500, "Failed to publish video");
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, newVideo, "Video published successfully")
    )
})



const getVideoById = asyncHandler (async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Video ID is invalid");
  }

  const video = await Video.findById(videoId).populate("owner", "fullName email");

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "Video fetched successfully")
    )
})



const incrementVideoViews = asyncHandler (async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findByIdAndUpdate(
    videoId,
    { $inc: {views: 1} },
    { new: true }
  ).populate(
    "owner", "fullName email"
  )

  if (!video) {
    throw new ApiError(404, "Video not found")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "View increased successfully.")
    )
})



const updateVideo = asyncHandler (async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid object ID");
  }

  const updateData = {}
  if (title) updateData.title = title;
  if (description) updateData.description = description;

  if (req.file) {
    const thumbnailLocalPath = req.file.path;
    if (!thumbnailLocalPath) {
      throw new ApiError(400, "Thumbnail file missing")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail.url) {
      throw new ApiError(500, "Failed to upload thumbnail")
    }

    if (thumbnail?.url) updateData.thumbnail = thumbnail.url;

    const video = await Video.findOne({_id: videoId, owner: req.user?._id})
    const oldThumbnail = video?.thumbnail

    try {
      if (oldThumbnail) {
        const deleted = await deleteFromCloudinary(oldThumbnail, "image");
        if (deleted.result !== "ok") {
          console.log(`Old thumbnail deletion failed: ${deleted.result}`)
        }
      }
    } catch (error) {
      console.error("Cloudinary deletion error: ", error)
    }
  }


  const updatedVideo = await Video.findOneAndUpdate(
    {_id: videoId, owner: req.user?._id},
    { $set: updateData },
    { new: true, runValidators: true }
  )

  if (!updatedVideo) {
    throw new ApiError(400, "Video not found")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideo, "Video updated successfully")
    )
})
// Put cloudinary upload in try catch with db update. otherwise uploaded on cloudinary even if failed in db



const deleteVideo = asyncHandler (async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid object ID");
  }

  const deletedVideo = await Video.findOneAndDelete(
    {_id: videoId, owner: req.user?._id}
  )

  if (!deletedVideo) {
    throw new ApiError(404, "Video not found or unauthorized to delete")
  }

  const deleted = await deleteFromCloudinary(deletedVideo.videoFile, "video");
  if (deleted.result !== "ok") {
    console.error("Video deletion failed from Cloudinary", deleted.result);
  }

  const deletedThumbnail = await deleteFromCloudinary(deletedVideo.thumbnail, "image")
  if (deletedThumbnail.result !== "ok") {
    console.error("Video deletion failed from Cloudinary", deletedThumbnail.result);
  }
  

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedVideo, "Video deleted successfully")
    )
})

const togglePublishStatus = asyncHandler ( async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid object ID");
  }

  const video = await Video.findOne(
    {_id: videoId, owner: req.user?._id},
  )
  if (!video) {
    throw new ApiError(404, "Video not found or unauthorized")
  }

  video.isPublished = !video.isPublished;
  await video.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, video, "Publish status updated successfully")
    )
})

export { getAllVideos, publishVideo, getVideoById, incrementVideoViews, updateVideo, deleteVideo , togglePublishStatus};