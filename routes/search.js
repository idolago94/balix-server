var express = require('express');
var router = express.Router();
const searchController = require('../controllers/search');


router.get('/', searchController.handleSearch);

module.exports = router;
