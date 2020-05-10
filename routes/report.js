var express = require('express');
var router = express.Router();
const reportController = require('../controllers/report');


router.put('/', reportController.report);

router.get('/inappropiate', (req, res) => {
    let inappropiate_options = [
        'Nudity or sexual activity',
        'Hate speech or hate symbols',
        'Violent or dangerous organizations',
        'Sale or promotion of invalid or regulated products',
        'Bullying or harassment',
        'Intellectual Property Violation',
        'Suicide, self-injury or eating disorders',
        'Fraud or fraud',
        'Wrong information',
        `I just don't like it`
    ];
    res.json(inappropiate_options);
})

module.exports = router;
