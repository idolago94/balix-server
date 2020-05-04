const Message = require('../models/Message');

const addMessage = async(room_id, user_id, context) => {
    let newMessage = new Message({
        room_id,
        user_id,
        context
    });
    let response = await newMessage.save();
    return response;
}

const getRoomMessages = async(room_id) => {
    let roomMessages = await Message.find({room_id});
    return roomMessages;
}

module.exports = {
    addMessage,
    getRoomMessages
}
