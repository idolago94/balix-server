const mongoose = require('mongoose');

const Emoji = mongoose.model('Emojis',
 {
  url: String,
  name: String,
  value: Number,
//    active: Boolean,
  animations: {type: Array, default: []},
  uploadDate: {type: Date, default: new Date()}
 });

 module.exports=Emoji;