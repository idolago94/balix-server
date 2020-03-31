var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');
const upload = require('../middleware/upload');

router.get('/getSingleUser', userController.getSingleUser);

router.get('/getUsers', userController.getUsers);

router.get('/getAll', userController.getAllUsers);

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.put('/startFollow', userController.startFollow);

router.put('/stopFollow', userController.stopFollow);

router.post('/buyPackage', userController.buyPackage);

router.post('/updateProfileImage',upload.profile.single('file') , userController.updateProfileImage);

router.put('/updateKeywords', userController.updateKeywords);

router.put('/update', userController.updateUser);

router.put('/addExtra', userController.addExtra);

module.exports = router;
