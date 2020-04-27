const actionMiddleware = require('../middleware/actions');
const actionType = require('../helpers/actions.type');

const getActions = async(req, res) => {
    console.log('actionController[getActions]');
    let user_id = req.headers.user;
    let response = await actionMiddleware.getUserActions(user_id);
    res.json(response);
}

const getTypes = (req, res) => {
    res.json(actionType);
}

module.exports = {
    getActions: getActions,
    getTypes: getTypes
}
