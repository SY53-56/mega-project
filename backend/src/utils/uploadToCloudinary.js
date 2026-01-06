const cloudinary = require("../config/cloudinary")
const streamifier = require("streamifier");

const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: "blogs" }, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
  module.exports = uploadBufferToCloudinary