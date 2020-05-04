var express = require('express');
var router = express.Router();
const tokenMiddleware = require('../middleware/token');
const adminController = require('../controllers/admin');

router.post('/create', tokenMiddleware.adminVerify, adminController.saveAdmin);

router.post('/login', adminController.login);

router.get('/all', tokenMiddleware.adminVerify, adminController.getAll);

module.exports = router;
