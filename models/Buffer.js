const mongoose = require('mongoose');

const BufferS = mongoose.model('BufferS',
 {
   data: Buffer,
 });

 module.exports=BufferS;