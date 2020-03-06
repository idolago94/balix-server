var express = require('express');
var router = express.Router();
const actionController = require('../controllers/actions');

/* GET home page. */
router.get('/getActions', actionController.getActions);

module.exports = router;
