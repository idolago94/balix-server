var express = require('express');
var router = express.Router();
const animationController = require('../controllers/animation');
const uploadMiddleware = require('../middleware/upload');

router.get('/', animationController.getById);

router.get('/all', animationController.getAll);

router.post('/add', animationController.addAnimation);

router.delete('/delete', animationController.deleteAnimation);

module.exports = router;
