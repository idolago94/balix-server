const mongoose = require('mongoose');

const Comment = mongoose.model('Comments',
 {
   sender_id: String,
   content_id: String,
   data: String,
   date: Date
 });

 module.exports=Comment;