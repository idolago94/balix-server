const mongoose = require('mongoose');

const Action = mongoose.model('Actions',
 {
   type: Number,
   active_user_id: String,
   disactive_user_id: String,
   image_buffer_id: String,
   emoji: Object,
   date: Date
 });

 module.exports=Action;