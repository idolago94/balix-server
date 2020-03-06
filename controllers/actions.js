const userMiddleware = require('../middleware/users');
const upload = require("../middleware/upload");
const actionMiddleware = require('../middleware/actions');
const actionType = require('../helpers/actions.type');

const getActions = async(req, res) => {
    console.log('actionController[getActions]');
    let user_id = req.query.id;
    let response = await actionMiddleware.getUserActions(user_id);
    res.json(response);
}

module.exports = {
    getActions: getActions
}
