import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js"

const getVideoComments = asyncHandler ( async (req, res) => {

})

const addComment = asyncHandler ( async (req, res) => {

})

const updateComment = asyncHandler( async (req, res) => {

})

const deleteComment = asyncHandler ( async (req, res) => {

})


export { getVideoComments, addComment, updateComment, deleteComment }