var express = require('express');
var router = express.Router();
const emojiController = require('../controllers/emoji');
const uploadMiddleware = require('../middleware/upload');

router.get('/all', emojiController.getAll);

router.post('/add', uploadMiddleware.emoji.single('file'), emojiController.addEmoji);

router.delete('/delete', emojiController.deleteEmoji);

router.put('/update', emojiController.updateEmoji);

module.exports = router;
