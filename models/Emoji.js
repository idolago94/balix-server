const mongoose = require('mongoose');

const Emoji = mongoose.model('Emojis',
 {
  url: String,
  name: String,
  value: Number,
//    active: Boolean,
  animations: {type: Array, default: []},
  uploadDate: Date
 });

 module.exports=Emoji;