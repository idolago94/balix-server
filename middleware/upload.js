const multer = require('multer');
const fs = require("fs");

const storageContent = multer.diskStorage({

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
    // cb(null, false); // to reject the file
    // You can always pass an error if something goes wrong:
    // cb(new Error('I don\'t have a clue!'))

    cb(null, path);
  }
})

const storageProfile = multer.diskStorage({
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