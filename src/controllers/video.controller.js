import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler( async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
})

const publishVideo = asyncHandler( async (req, res) => {
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

export { getAllVideos, publishVideo };