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
            } else if(err.name == 'TokenExpiredError') {
                res.json({error: 'TokenExpiredError'});
            } else {
                res.json({error: 'Authentication error.'});
            }
        });
    }
}

const refresh = (req, res, next) => {
    console.log('tokenModdleware[refresh]');
    let user_id = req.query.id;
    let token = req.headers['authorization'];
    token = token.slice(7, token.length);
    jwt.verify(token, secret, async(err, decode) => {
        console.log('jwt verify -> ', err, decode);
        if(!err) {
            res.json(token);
        } else {
            if(err.name == 'TokenExpiredError') {
                let refreshToken = await generate({user_id});
                res.json(refreshToken);
            } else {
                res.json({error: 'Authentication error.'});
            }
        }
    });
}

module.exports = {generate, verify, refresh};