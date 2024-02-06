const express = require("express");
const router = express.Router();
const {
  validateAdd,
  addSongSchema,
  updateSongSchema,
} = require("../Validators/SongValidator");
const SongController = require("../Controllers/SongController");

router.get("/test", (req, res) => {
  res.send(true);
});

// Post Requests
router.post(
  "/add-song",
  validateAdd(addSongSchema),
  SongController.createSong
);

// Get Requests
router.get("/get-song/:title", SongController.getSong);
router.get("/list-song", SongController.listSongs);
router.get("/list-artist", SongController.listArtist);
router.get("/list-album", SongController.listAlbum);
router.get("/list-genre", SongController.listGenre);
router.get("/statistics", SongController.getSongStatistics);

// Put Requests
router.put(
  "/update-song/:title",
  validateAdd(updateSongSchema),
  SongController.updateSong
);

// Delete Requests
router.delete("/remove-song/:title", SongController.deleteSong);

module.exports = router;
