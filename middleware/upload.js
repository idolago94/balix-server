const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const database = require('../database');

var storage = new GridFsStorage({
  // MongoDB connection
  url: `'mongodb://localhost/${database.db_name}`,
  // customizes how to establish the connection
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  // function to control the file storage in the database
  file: (req, file) => {
    console.log('uploadMiddleware');

    const match = ["image/png", "image/jpeg"];

    // check if the file is an image or not
    if (match.indexOf(file.mimetype) === -1) {
      const filename = `${Date.now()}-${database.app_name}-${file.originalname}`;
      return filename;
    }

    return ({
      // indicates that the file will be stored at images.chunks and images.files collections
      bucketName: "images",
      filename: `${Date.now()}-${database.app_name}-${file.originalname}`,
    });
  }
});
// initialize middleware(The single() function with the parameter is the name of input tag)
var uploadFile = multer({ storage: storage, limits: { fieldSize: 25 * 1024 * 1024 } }).single("file");
// make the exported middleware object can be used with async-await
var uploadFilesMiddleware = util.promisify(uploadFile);
module.exports = uploadFilesMiddleware;
