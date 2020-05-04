const adminMiddleware = require('../middleware/admin');
const tokenMiddleware = require('../middleware/token');

const saveAdmin = async(req, res) => {
    let data = req.body;
    let response = adminMiddleware.save(data);
    res.json(response);
}

const login = async(req, res) => {
    let authData = req.body;
    let result = await adminMiddleware.auth(authData.username, authData.password);
    if(result) {
        let admin_token = await tokenMiddleware.generate({admin: true});
        res.json({admin_token});
    } else res.json({err: 'Authentication Error.'});
}

const getAll = async(req, res) => {
    let response = await adminMiddleware.getAll();
    res.json(response);
}

module.exports = {
    saveAdmin,
    login,
    getAll
}
