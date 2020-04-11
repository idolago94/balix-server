const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   first_name: {type: String, required: true},
   last_name: {type: String, required: true},
   username: {type: String, text: true, required: true},
   password: {type: String, required: true},
   email: {type: String, required: true},
   gender: String,
   profileImage: String || undefined,
   uploads: {type: Array, default: []}, // array of objects({id, contentType, uploadDate, cash, hearts, base64})
   following: {type: Array, default: []}, // array of user_id
   followers: {type: Array, default: []}, // array of user_id
   cash: {type: Number, default: 0},
   cash_earned: {type: Number, default: 0},
   hearts: {type: Number, default: 0},
   hearts_earned: {type: Number, default: 0},
   conversations: {type: Array, default: []}, // array of conversation_id
   keywords: {type: Array, text: true, default: []}, // array of strings
   live: String || undefined,
   // story: Array || undefined // array of objects({id, contentType, uploadDate, cash, hearts, base64})
   lastContentUpdate: Date,
   limit_of_contents: { type: Number, default: 9 },
   secrets: {type: Array, default: []},
   country: String || undefined,
   date_of_birth: Date || undefined
});
userSchema.index({username: "text", keywords: "text"});
const User = mongoose.model('Users', userSchema);

 module.exports=User;
