const express = require('express');
const upload = require("../middlewares/upload.middleware");
const songController = require("../controllers/song.controller");

const router = express.Router();

/**
 * @route POST /api/songs
 * @desc Upload a new song
 * @access Public
 */
router.post("/" , upload.single("song") , songController.songUpload);

module.exports = router;














