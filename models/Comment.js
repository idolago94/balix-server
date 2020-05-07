const mongoose = require('mongoose');

const Comment = mongoose.model('Comments',
 {
   sender_id: String,
   content_id: String,
   data: String,
   date: {type: Date, default: new Date()}
 });

 module.exports=Comment;