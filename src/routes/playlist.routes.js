import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createPlaylist, deletePlaylist, getUserPlaylists, updatePlaylist, getPlaylistById } from "../controllers/playlist.controller.js";

const router = Router();
router.use(verifyJWT)

router.route("/").post(createPlaylist)

router.route("/:playlistId")
  .get(getPlaylistById)
  .delete(deletePlaylist)
  .patch(updatePlaylist)

router.route("/user/:userId").get(getUserPlaylists)

export default router;