const songModel = require("../models/songs.model");
const id3 = require("node-id3");


const songUpload = async (req , res) => {
    const tags = id3.read(req.file.buffer);
    console.log(tags);
};















module.exports = {
    songUpload
}