const mongoose = require('mongoose');

const ChatRoom = mongoose.model('ChatRooms',
 {
   participants: {type: Array, default: []},
   created_at: {type: Date, default: new Date()},
   last_message: {type: Date, default: new Date()}
 });

 module.exports=ChatRoom;

