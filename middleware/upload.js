const multer = require('multer');
const fs = require("fs");

let storageContent = multer.diskStorage({

  // pass function that will generate destination path
  destination: (req, file, cb) => {
    let path = `./files/${req.query.id}/`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    path = path + (req.query.secret ? ('secrets/'):('uploads/'));
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    // fs.readdirSync(testFolder).forEach(file => {
    //   // file in the specific path
    //   console.log(file);
    // });

    cb(
      null, 
      path
    );
  }
})

let storageProfile = multer.diskStorage({

  // pass function that will generate destination path
  destination: (req, file, cb) => {
    let path = `./files/${req.query.id}/`;

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }

    // fs.readdirSync(testFolder).forEach(file => {
    //   // file in the specific path
    //   console.log(file);
    // });

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