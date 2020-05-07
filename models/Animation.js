const mongoose = require('mongoose');

const Animation = mongoose.model('Animations',
 {
   url: String,
   name: String,
   uploadDate: {type: Date, default: new Date()}
 });

 module.exports=Animation;