const multer = require('multer');
const fs = require("fs");
const userMiddleware = require('./users');
const URL = require('../helpers/path');
var ffmpeg = require('fluent-ffmpeg');

const storageContent = multer.diskStorage({
  // pass function that will generate destination path
  destination: async(req, file, cb) => {
    let path = `./files/${req.query.id}/`;
    console.log(file);

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    path = path + (req.query.secret ? ('secrets/'):('uploads/'));
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    let limit = 9;
    if(!req.query.secret) {
      let user = await userMiddleware.getUser(req.query.id);
      limit = user.limit_of_contents;
    }

    if(fs.readdirSync(path).length >= limit) {
      cb('You got your limit of uploads.');
    }

    cb(null, path);
  }
});

const storageProfile = multer.diskStorage({
  destination: (req, file, cb) => {
    let path = `./files/${req.query.id}/`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    fs.readdirSync(path).forEach(file => {
      !fs.lstatSync(path + file).isDirectory() && fs.unlinkSync(path + file);
    });

    cb(
      null, 
      path
    );
  }
});

const deleteFromStorage = (url) => {
  let path = URL.getPath(url);
  fs.unlinkSync(path);
  return true;
};

const containerVideo = multer.diskStorage({
  // pass function that will generate destination path
  destination: async(req, file, cb) => {
    let path = `./files/${req.query.id}/`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    path = path + (req.query.secret ? ('secrets/'):('uploads/'));
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    let limit = 9;
    // if(!req.query.secret) {
    //   let user = await userMiddleware.getUser(req.query.id);
    //   limit = user.limit_of_contents;
    // }

    if(fs.readdirSync(path).length >= limit) {
      cb('You got your limit of uploads.');
    }

    cb(null, './container/');
  }
});

const storageVideo = (req, res, next) => {
  let videoFile = req.file;
  // videoFile - return from multer (fieldname, originalname, encoding, mimetype, destination, filename, path, size)
  let outputPath = `${__dirname}/../files/${req.query.id}/${req.query.secret ? ('secrets/'):('uploads/')}${videoFile.filename}`;
  ffmpeg(`${__dirname}/../${videoFile.path}`)
    .inputOptions(['-vcodec h264', '-acodec aac'])
    .on("start", commandLine => {
      console.log(`Spawned FFmpeg with command: ${commandLine}`);
    })
    .on("error", (err, stdout, stderr) => {
      console.log(err, stdout, stderr);
      throw new Error('Convert Failed');
    })
    .on("end", (stdout, stderr) => {
      console.log(stdout, stderr);
      next();
    })
    .saveToFile(outputPath);
}

module.exports = {
  content: multer({storage: storageContent}),
  profile: multer({storage: storageProfile}),
  containerVideo: multer({storage: containerVideo, limits: {fieldSize: 2*1000*1000}}),
  deleteFromStorage: deleteFromStorage,
  storageVideo: storageVideo
}