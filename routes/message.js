var express = require('express');
var router = express.Router();
const tokenMiddleware = require('../middleware/token');
const messageController = require('../controllers/message');

router.get('/room', tokenMiddleware.verify, messageController.getRoomMessages);

router.post('/send', tokenMiddleware.verify, messageController.sendMessage);

module.exports = router;
