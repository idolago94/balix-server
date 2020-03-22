var express = require('express');
var router = express.Router();
const bufferController = require('../controllers/buffers');

/* GET home page. */
router.get('/', bufferController.getBuffer);

router.get('/some', bufferController.getSomeBuffers);

router.get('/all', bufferController.getAll);

module.exports = router;
