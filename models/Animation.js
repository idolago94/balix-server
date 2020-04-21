const mongoose = require('mongoose');

const Animation = mongoose.model('Animations',
 {
   url: String,
   name: String,
   uploadDate: Date
 });

 module.exports=Animation;