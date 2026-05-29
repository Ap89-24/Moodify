const ImageKit = require("@imagekit/nodejs").default;

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});


const uploadImage = async ({buffer,filename,folder=""}) => {

    const file = await client.files.upload({
        file: await ImageKit.toFile(Buffer.from(buffer)),
        filename: filename,
        folder
    });

    return file;
};



module.exports = {uploadImage}