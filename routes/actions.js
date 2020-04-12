var express = require('express');
var router = express.Router();
const actionController = require('../controllers/actions');
const tokenMiddleware = require('../middleware/token');

/* GET home page. */
router.get('/getActions', tokenMiddleware.verify, actionController.getActions);

router.get('/type', actionController.getTypes);

module.exports = router;
