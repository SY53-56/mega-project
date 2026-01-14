const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier"); // ✅ import added

const uploadStreamToCloud = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "blogs", resource_type: "image", quality: "auto" },
      (err, result) => (err ? reject(err) : resolve(result))
    );

    // buffer ko stream me convert karke Cloudinary me pipe karo
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

module.exports = uploadStreamToCloud;
