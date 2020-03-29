var express = require('express');
var router = express.Router();
const imageController = require('../controllers/images');
const contentController = require('../controllers/content');

router.post('/upload', contentController.uploadContent);

router.get('/getAll', contentController.getAll);

router.put('/update', contentController.updateAchievement);

router.get('/userContent', contentController.getUserContent);

router.get('/getContents', contentController.getSomeContents);

router.post('/uploadSecret', contentController.uploadSecret)

router.put('/addSecretView', contentController.addSecretView);

router.get('/top', contentController.getTop);

// router.get('/getSingleContent', imageController.getSingleImage);
//
// router.get('/getUserContent', imageController.getImages);

module.exports = router;
