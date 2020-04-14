var express = require('express');
var router = express.Router();
var path = require('path');
const fs = require("fs");
const URL = require('../helpers/path');

/* GET home page. */
router.get('/get', express.static(path.join(__dirname, 'emojis')));

router.get('/get', (req, res, next) => {
    let json = {};
    fs.readdirSync().forEach((fileName) => {
        json[fileName.slice(0, fileName.indexOf('.'))] = URL.generateUrl(`emoji/${fileName}`);
    });
    res.json(json)
})

module.exports = router;
