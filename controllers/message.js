const messageMiddleware = require('../middleware/message');
const chatRoomMiddleware = require('../middleware/chatRoom');

const getRoomMessages = async(req, res) => {
    console.log('messageController[getRoomMessages]');
    let room_id = req.query.id;
    let roomMessages = await messageMiddleware.getRoomMessages(room_id);
    res.json(roomMessages);
}

const sendMessage = async(req, res) => {
    let room_id = req.quey.id;
    let user_id = req.headers.user;
    let context = req.body.context;
    let roomData = await chatRoomMiddleware.getRoomById(room_id);
    if(!roomData) {
        let otherUser = req.body.receive;
        roomData = await chatRoomMiddleware.createRoom([otherUser, user_id]);
        room_id = roomData._id;
    }
    let sendResponse = await messageMiddleware.addMessage(room_id, user_id, context);
    res.json(sendResponse);
}

module.exports = {
    getRoomMessages,
    sendMessage
}
