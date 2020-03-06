var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');

router.get('/getToken', async(req, res) => {
    let client_id = 'AXK3iFS-_WjwDTNE_8sopDG2YB5n4zQtL0jv0vGfhgaLCLtrL5YA8cCtvTgS7mqGi7GpqiMMR3TAFg83';
    let secret = 'ELBYEz1uv47Ui45iGwN5OCr-VGB2qFLiRu7h9NI3UyYjRXSL819OUtmE3V1BnQ_K8QhipD0yvdWtO8sJ';
    // fetch('https://api.sandbox.paypal.com/v1/oauth2/token?grant_type=client_credentials', {
    fetch('https://api.paypal.com/v1/oauth2/token?grant_type=client_credentials', {

        method: 'POST',
        headers: {
            'Authorization': "Basic " + new Buffer(client_id + ":" + secret).toString("base64"),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(response => response.json()).then(response => {
        console.log(response);
        res.json(response);
    });
});

module.exports = router;
