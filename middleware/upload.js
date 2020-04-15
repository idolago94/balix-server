const multer = require('multer');
const fs = require("fs");
const userMiddleware = require('./users');
const URL = require('../helpers/path');
var ffmpeg = require('fluent-ffmpeg');
var path = require('path');

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

// const containerVideo = multer.diskStorage({
//   // pass function that will generate destination path
//   destination: async(req, file, cb) => {
//     let path = `./files/${req.query.id}/`;

//     if (!fs.existsSync(path)) {
//       fs.mkdirSync(path);
//     }

//     path = path + (req.query.secret ? ('secrets/'):('uploads/'));
//     if (!fs.existsSync(path)) {
//       fs.mkdirSync(path);
//     }

//     let limit = 9;
//     // if(!req.query.secret) {
//     //   let user = await userMiddleware.getUser(req.query.id);
//     //   limit = user.limit_of_contents;
//     // }

//     if(fs.readdirSync(path).length >= limit) {
//       cb('You got your limit of uploads.');
//     }

//     cb(null, './container/');
//   }
// });

const compress = async(req, res, next) => {
  let file = req.file;
  // file - return from multer (fieldname, originalname, encoding, mimetype, destination, filename, path, size)
  let outputPath = `files/${req.query.id}/${req.query.id, req.query.secret ? ('secrets/'):('uploads/')}/${file.originalname}`;
  const inputMetadata = await metadata(path.join(__dirname, '..', file.path));
  const bitrate = whatBitrate(inputMetadata.format.size);
  const limit_size = 1000*1000; // 1MB
  console.log('inputMetadata', inputMetadata);
  if(inputMetadata.format.size > limit_size || inputMetadata.format.format_name.includes('jpeg') || inputMetadata.format.format_name.includes('jpg') || inputMetadata.format_long_name.includes('png')) {
    ffmpeg(path.join(__dirname, '..', file.path))
      .outputOptions(['-c:v libx264', `-b:v ${bitrate}k`, '-c:a aac', '-b:a 58k'])
      .on("start", commandLine => {
        console.log(`Spawned FFmpeg with command: ${commandLine}`);
      })
      .on("error", (err, stdout, stderr) => {
        console.log(err, stdout, stderr);
        fs.unlinkSync(file.path);
        res.json({error: 'Convert Failed'});
      })
      .on("end", (stdout, stderr) => {
        console.log('end', stdout, stderr);
        fs.unlinkSync(file.path);
        req.filePath = outputPath;
        next();
      })
      .output(path.join(__dirname, '..', outputPath)).run();
  } else {
    req.filePath = file.path;
    next();
  }
}

module.exports = {
  content: multer({storage: storageContent, limits: {fieldSize: 4*1000*1000}}),
  profile: multer({storage: storageProfile}),
  // containerVideo: multer({storage: containerVideo, limits: {fieldSize: 2*1000*1000}}),
  deleteFromStorage,
  compress
}

function metadata (path) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) {
        reject(err)
      }
      resolve(metadata)
    })
  })
}

function whatBitrate (bytes) {
  const ONE_MB = 1000000
  const BIT = 28 // i found that 28 are good point fell free to change it as you feel right
  const diff = Math.floor(bytes / ONE_MB)
  if (diff < 5) {
    return 128
  } else {
    return Math.floor(diff * BIT * 1.1)
  }
}