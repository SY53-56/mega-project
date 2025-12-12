const multer = require("multer");

// Memory storage keeps files in memory temporarily
const storage = multer.memoryStorage();
const uploads = multer({ storage });

module.exports = uploads;
