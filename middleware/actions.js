const Action = require('../models/Action');
const URL = require('../helpers/path')

const addAction = async(type, active_user, disactive_user, image, emoji) => {
    console.log('actionsMiddleware[addAction]');
    let newAction = new Action({
        type: type,
        active_user_id: active_user,
        disactive_user_id: disactive_user || undefined,
        image_url: image ? image.url ? (image.url):(URL.generateUrl(image.mimetype, image.path)):(undefined),
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
