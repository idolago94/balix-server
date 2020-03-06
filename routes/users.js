var express = require('express');
var router = express.Router();
const userController = require('../controllers/users');


router.get('/getSingleUser', userController.getSingleUser);

router.get('/getUsers', userController.getUsers);

router.get('/getAll', userController.getAllUsers);

router.post('/signup', userController.signup);

router.post('/login', userController.login);

router.put('/startFollow', userController.startFollow);

router.put('/stopFollow', userController.stopFollow);

router.post('/buyPackage', userController.buyPackage);

router.post('/updateProfileImage', userController.updateProfileImage);

router.put('/updateKeywords', userController.updateKeywords);

module.exports = router;
