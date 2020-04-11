let jwt = require('jsonwebtoken');

const secret = 'balixapp';

const generate = (payload) => {
    return new Promise(resolve => {
        let token = jwt.sign(payload, secret,{expiresIn: '24h'});
        console.log('tokenMiddleware[generate]', token);
        resolve(token);
    })
}

const verify = (req, res, next) => {
    let token = req.headers['authorization'];
    if(!token) {
        res.json({error: 'Authentication error.'});
    } else {
        if (token.startsWith('Bearer ')) {
          // Remove Bearer from string
          token = token.slice(7, token.length);
        }
        jwt.verify(token, secret, (err, decode) => {
            if(!err) {
                next();
            } else {
                res.json({error: 'Authentication error.'});
            }
        });
    }
}

module.exports = {generate, verify};