var express = require('express');
var router = express.Router();
const tokenMiddleware = require('../middleware/token');
const adminController = require('../controllers/admin');

router.post('/create', adminController.saveAdmin);

router.post('/login', adminController.login);

router.get('/all', tokenMiddleware.verify, adminController.getAll);

module.exports = router;
