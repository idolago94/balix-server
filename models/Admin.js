const mongoose = require('mongoose');

const Admin = mongoose.model('Admins',
 {
   full_name: String,
   username: String,
   password: String,
   created_at: {type: Date, default: new Date}
 });

 module.exports=Admin;