const songModel = require("../models/songs.model");
const id3 = require("node-id3");
const storageService = require("../services/storage.service");


const songUpload = async (req , res) => {
    const songBuffer = req.file.buffer;
    const tags = id3.read(songBuffer);
    const {mood} = req.body;
    console.log(tags);


    /**
     * @description-> Upload song and poster concurrently to optimize performance...
     */
    
     const [songFile , poster] = await Promise.all([
     storageService.uploadImage({
        buffer: songBuffer,
        filename: (tags.title + "song") + ".mp3",
        folder: "/cohort/moodify/songs"
    }),
     storageService.uploadImage({
        buffer: tags?.image?.imageBuffer,
        filename: (tags.title + "song") + ".jpeg",
        folder: "/cohort/moodify/posters"
    })
]);

    const song = await songModel.create({
        title: tags.title,
        songUrl: songFile.url,
        posterUrl: poster.url,
        mood
    });

    return res.status(201).json({
        success: true,
        message: "Song uploaded successfully",
        song
    });
};


const getSong = async (req , res) => {
    const {mood} = req.query;

    const song = await songModel.findOne({
        mood,
    });

    return res.status(201).json({
        success: true,
        message: "song fetched successfully",
        song
    });
};














module.exports = {
    songUpload,
    getSong
}