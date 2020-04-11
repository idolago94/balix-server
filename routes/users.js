var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');
const upload = require('../middleware/upload');
const tokenMiddleware = require('../middleware/token');

router.get('/getSingleUser', tokenMiddleware.verify, userController.getSingleUser);

router.get('/getUsers', tokenMiddleware.verify, userController.getUsers);

router.get('/getAll', tokenMiddleware.verify, userController.getAllUsers);

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.put('/startFollow', tokenMiddleware.verify, userController.startFollow);

router.put('/stopFollow', tokenMiddleware.verify, userController.stopFollow);

router.post('/buyPackage', tokenMiddleware.verify, userController.buyPackage);

router.post('/updateProfileImage', tokenMiddleware.verify,upload.profile.single('file') , userController.updateProfileImage);

router.put('/updateKeywords', tokenMiddleware.verify, userController.updateKeywords);

router.put('/update', tokenMiddleware.verify, userController.updateUser);

router.put('/addExtra', tokenMiddleware.verify, userController.addExtra);

module.exports = router;
