const mongoose = require('mongoose');

const Message = mongoose.model('Messages',
 {
   context: String,
   user_id: String,
   room_id: String,
   date: {type: Date, default: new Date()}
 });

 module.exports=Message;