import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Playlist } from "../models/playlist.models.js"

const createPlaylist = asyncHandler ( async (req, res) => {

})



const deletePlaylist = asyncHandler ( async (req, res) => {
  
})



const updatePlaylist = asyncHandler ( async (req, res) => {
  
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