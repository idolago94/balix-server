const multer = require('multer');
const fs = require("fs");
const userMiddleware = require('./users');

const storageContent = multer.diskStorage({
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
    if(!req.query.secret) {
      let user = await userMiddleware.getUser(req.query.id);
      limit = user.limit_of_contents;
    }
    console.log(limit);
    if(fs.readdirSync(path).length >= limit) {
      cb('You got your limit of uploads.');
    }

    cb(null, path);
  }
})

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
})

module.exports = {
  content: multer({storage: storageContent}),
  profile: multer({storage: storageProfile})
}