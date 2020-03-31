const Action = require('../models/Action');
const generateUrl = require('../helpers/path')

const addAction = async(type, active_user, disactive_user, image_url, emoji) => {
    console.log('actionsMiddleware[addAction]');
    let newAction = new Action({
        type: type,
        active_user_id: active_user,
        disactive_user_id: disactive_user || undefined,
        image_url: generateUrl(image_url),
        emoji: emoji,
        date: new Date()
    });
    let response = await newAction.save();
    return response;
}

const getUserActions = async(user_id) => {
    console.log('actionsMiddleware[getUserActions]');
    let response = await Action.find({ $or: [{active_user_id: user_id}, {disactive_user_id: user_id}] });
    return response;
}

module.exports = {
    addAction: addAction,
    getUserActions: getUserActions
}
