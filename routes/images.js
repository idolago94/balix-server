var express = require('express');
var router = express.Router();
const imageController = require('../controllers/images');

router.post('/upload', imageController.uploadImage);

router.post('/uploadCamera', imageController.uploadFromCamera);

router.get('/getSingleImage', imageController.getSingleImage);

router.get('/getImages', imageController.getImages);

router.put('/updateAchievement', imageController.updateAchievement);

module.exports = router;
