var express = require('express');
var router = express.Router();
const contentController = require('../controllers/content');
const upload = require('../middleware/upload');

router.post('/upload', upload.content.single('file'), upload.compress, contentController.uploadContent);

router.get('/getAll', contentController.getAll);

router.put('/update', contentController.updateAchievement);

// router.get('/userContent', contentController.getUserContent);

router.get('/getContents', contentController.getSomeContents);

router.put('/addSecretView', contentController.addSecretView);

router.get('/top', contentController.getTop);

router.put('/delete', contentController.deleteContent);

module.exports = router;
