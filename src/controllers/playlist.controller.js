import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.models.js"

const createPlaylist = asyncHandler ( async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    throw new ApiError(400, "Name is required.")
  }

  const newPlaylist = await Playlist.create({
    name,
    ...(description && {description}),
    owner: req.user?._id
  })

  if (!newPlaylist) {
    throw new ApiError(500, "Failed to create playlist")
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, newPlaylist, "Playlist created successfully")
    )
})



const deletePlaylist = asyncHandler ( async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const deletedPlaylist = await Playlist.findOneAndDelete({
    _id: playlistId,
    owner: req.user?._id
  })

  if (!deletedPlaylist) {
    throw new ApiError(404, "Playlist not found or unauthorized to delete")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, deletedPlaylist, "Playlist deleted successfully.")
    )
})



const updatePlaylist = asyncHandler ( async (req, res) => {
  const { name, description } = req.body;

  if ((!name || name.trim() === "") && (!description || description.trim() === "")) {
    throw new ApiError(400, "At least one non-empty field is required");
  }

  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID")
  }

  const updateData = {};
  if (name) updateData.name = name;
  if (description) updateData.description = description;

  const updatedPlaylist = await Playlist.findOneAndUpdate(
    { _id: playlistId, owner: req.user?._id },
    { $set: updateData },
    { new: true }
  )

  if (!updatedPlaylist) {
    throw new ApiError(404, "Playlist not found or unauthorized to update.")
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedPlaylist, "Playlist updated successfully.")
    )
})



const getUserPlaylists = asyncHandler ( async (req, res) => {

})



const getPlaylistById = asyncHandler ( async (req, res) => {
  
})



const addVideoToPlaylist = asyncHandler ( async (req, res) => {
  
})



const removeVideoFromPlaylist = asyncHandler ( async (req, res) => {
  
})


export { createPlaylist, deletePlaylist, updatePlaylist, getPlaylistById, getUserPlaylists, addVideoToPlaylist, removeVideoFromPlaylist }