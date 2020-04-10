var express = require('express');
var router = express.Router();
const commentsController = require('../controllers/comments');

/* GET home page. */
router.get('/content', commentsController.getContentComment);

router.post('/add', commentsController.addComment);

module.exports = router;
